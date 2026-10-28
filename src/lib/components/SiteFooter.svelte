<script lang="ts">
	import Mark from './Mark.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-line bg-ink/40">
	<div class="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-2">
				<div class="flex items-center gap-2.5">
					<Mark />
					<span class="font-mono text-[13px] tracking-tight">shuvarie</span>
				</div>
				<p class="mt-3 max-w-xs text-[13px] leading-relaxed text-fog">
					An agentic AI pair-programmer that lives in your terminal — for chivalrous people.
				</p>
				<p class="mt-5 font-mono text-2xs tracking-[0.18em] text-fog-dim uppercase">
					rust · tui · kdl · mit
				</p>
			</div>

			<nav class="flex flex-col gap-2 font-mono text-xs">
				<span class="mb-1 text-2xs tracking-[0.18em] text-fog-dim uppercase">site</span>
				<a class="gold-underline w-fit text-fog hover:text-chalk" href="/docs">docs</a>
				<a class="gold-underline w-fit text-fog hover:text-chalk" href="/docs/install">install</a>
				<a class="gold-underline w-fit text-fog hover:text-chalk" href="/about">about</a>
			</nav>

			<div class="font-mono text-xs">
				<span class="mb-2 block text-2xs tracking-[0.18em] text-fog-dim uppercase">elsewhere</span>
				<a
					class="gold-underline block w-fit text-fog hover:text-chalk"
					href="https://github.com/shuvarie/shuvarie"
					target="_blank"
					rel="noreferrer">github</a
				>
				<a
					class="gold-underline block w-fit text-fog hover:text-chalk"
					href="https://github.com/shuvarie/shuvarie/blob/main/LICENSE"
					target="_blank"
					rel="noreferrer">license</a
				>
				<a class="gold-underline block w-fit text-fog hover:text-chalk" href="mailto:shuvarie-org@pm.me"
					>mail</a
				>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-2xs text-fog-dim sm:flex-row sm:items-end sm:justify-between"
		>
			<p class="font-mono leading-relaxed">
				<span class="text-fog">白き騎士</span> / コードの闇へ / 光差す
				<span class="ml-1 opacity-60">— moonshotai/Kimi-K2.6</span>
			</p>
			<p class="font-mono">© {year} Charles Dong · MIT</p>
		</div>
	</div>
</footer>
