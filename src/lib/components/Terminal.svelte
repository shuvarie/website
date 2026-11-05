<script lang="ts">
	import 'asciinema-player/dist/bundle/asciinema-player.css';
	import { onMount } from 'svelte';
	import type { Player } from 'asciinema-player';

	/**
	 * The hero terminal is a real asciinema recording (`static/demo/*.cast`),
	 * played by the asciinema player — a Rust/WASM core over a text file, so the
	 * transcript stays selectable. The player and the 2.4 MB cast are fetched
	 * only once the panel is about to be seen, keeping the first paint cheap.
	 */
	type Props = { class?: string };

	let { class: className = '' }: Props = $props();

	const SRC = '/demo/shuvarie-demo2.cast';
	const COLS = 116;
	const ROWS = 31;
	/** Offered in the title bar. The player bakes `speed` in when it is created,
	 * so changing it rebuilds the player over the already-loaded recording. */
	const SPEEDS = [0.5, 1, 1.5, 2, 3];

	let host: HTMLDivElement | undefined = $state();
	let status: 'idle' | 'ready' | 'error' = $state('idle');
	let speed = $state(1);
	/** Keeps the box from collapsing while a new player is being built. */
	let ratio = $state(1.68);

	let player: Player | null = null;
	let create: typeof import('asciinema-player').create | null = null;
	let cast: Promise<string> | null = null;
	let playing = false;
	let booting = false;
	let autoplayed = false;
	let calm = false;
	let token = 0;

	/** Fetched once as text: rebuilding the player must not hit the network. */
	function loadCast() {
		if (!cast) {
			cast = fetch(SRC, { credentials: 'omit' }).then((response) => {
				if (!response.ok) throw new Error(`failed fetching ${SRC}: ${response.status}`);
				return response.text();
			});
			cast.catch(() => {
				cast = null;
			});
		}
		return cast;
	}

	async function mountPlayer(startAt: number, resume: boolean) {
		if (!host) return;
		const run = ++token;

		create ??= (await import('asciinema-player')).create;
		if (token !== run || !host) return;

		player?.dispose();
		player = null;

		try {
			const instance = create({ data: loadCast }, host, {
				// Pass the recording geometry so the panel doesn't resize once loaded.
				cols: COLS,
				rows: ROWS,
				fit: 'width',
				controls: true,
				speed,
				idleTimeLimit: 1,
				startAt,
				// A frame from the recording, shown while the cast streams in.
				poster: startAt > 0 ? undefined : 'npt:0:02',
				cursorMode: 'blinking',
				terminalFontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
				terminalLineHeight: 1.25
			});

			player = instance;
			playing = false;
			instance.addEventListener('playing', () => (playing = true));
			instance.addEventListener('pause', () => (playing = false));
			instance.addEventListener('ended', () => (playing = false));
			status = 'ready';
			if (resume) void instance.play();
			// `startAt` paints the right frame; seeking once more refreshes the timer
			// labels, which a player created paused otherwise leaves blank.
			else if (startAt > 0) void instance.seek(startAt);
		} catch (error) {
			console.error('shuvarie: the asciinema player failed to start', error);
			status = 'error';
		}
	}

	/** Rebuild the player where it is, with the new speed baked in. */
	function setSpeed(next: number) {
		if (next === speed) return;
		const at = player?.getCurrentTime() ?? 0;
		const resume = playing;
		speed = next;
		if (player) void mountPlayer(at, resume);
	}

	onMount(() => {
		if (!host) return;
		calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Measure the mounted player so the next rebuild keeps the same box.
		const measure = new ResizeObserver(() => {
			const wrapper = host?.firstElementChild;
			if (!wrapper) return;
			const { width, height } = wrapper.getBoundingClientRect();
			if (width > 0 && height > 0) ratio = width / height;
		});
		measure.observe(host);

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[entries.length - 1];

				if (!entry.isIntersecting) {
					void player?.pause();
					return;
				}

				if (player || booting) return;
				booting = true;

				// Play once, when the panel is properly on screen; from then on the
				// visitor owns the controls and we only pause when it scrolls away.
				// The second test covers viewports shorter than the panel itself.
				const onScreen =
					entry.intersectionRatio >= 0.45 || entry.intersectionRect.height >= innerHeight * 0.55;
				const resume = !autoplayed && !calm && onScreen;
				if (resume) autoplayed = true;

				void mountPlayer(0, resume).finally(() => (booting = false));
			},
			{ threshold: [0, 0.45], rootMargin: '150px 0px' }
		);

		observer.observe(host);

		return () => {
			observer.disconnect();
			measure.disconnect();
			player?.dispose();
			player = null;
		};
	});
</script>

<div class="panel relative overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] {className}">
	<!-- title bar -->
	<div
		class="flex items-center gap-2 border-b border-line bg-panel-2/60 px-3 py-2 font-mono text-2xs text-fog-dim"
	>
		<span class="flex shrink-0 gap-1.5">
			<span class="size-2 rounded-full bg-ember/70"></span>
			<span class="size-2 rounded-full bg-gold/70"></span>
			<span class="size-2 rounded-full bg-jade/70"></span>
		</span>
		<span class="ml-2 shrink-0 text-fog">shuvarie</span>
		<span class="hidden shrink-0 opacity-40 sm:inline">—</span>
		<span class="hidden min-w-0 truncate sm:inline">~/source/repos/shuvarie — 116×31</span>

		<div class="ml-auto flex shrink-0 items-center gap-3">
			<span class="hidden text-fog-dim/80 lg:inline">asciicast v3</span>
			<span
				class="flex items-center gap-0.5 border border-line/80 p-0.5"
				role="group"
				aria-label="Playback speed"
			>
				{#each SPEEDS as value (value)}
					<button
						type="button"
						onclick={() => setSpeed(value)}
						aria-pressed={value === speed}
						title="Play at {value}×"
						class="cursor-pointer rounded-[2px] px-1.5 py-0.5 tabular-nums transition-colors {value ===
						speed
							? 'bg-gold/15 text-gold'
							: 'text-fog-dim hover:bg-panel-2 hover:text-chalk'}"
					>
						{value}×
					</button>
				{/each}
			</span>
		</div>
	</div>

	<!-- the player draws its own terminal, timeline and fullscreen button here -->
	<div class="relative bg-[#000a13]" style:aspect-ratio={status === 'ready' ? null : ratio}>
		<div bind:this={host}></div>

		{#if status === 'error'}
			<div
				class="absolute inset-0 grid place-items-center px-6 text-center font-mono text-2xs text-fog-dim"
			>
				<p>
					the recording could not be played here —
					<a class="text-gold-soft underline underline-offset-4 hover:text-gold" href={SRC}>
						open the cast
					</a>
				</p>
			</div>
		{/if}
	</div>

	<noscript>
		<p class="border-t border-line px-4 py-3 font-mono text-2xs text-fog-dim">
			The demo is an asciinema recording and needs JavaScript.
			<a class="text-gold-soft underline underline-offset-4" href={SRC}>download it</a> and play it
			with <code>asciinema play</code>.
		</p>
	</noscript>
</div>
