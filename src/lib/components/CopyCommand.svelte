<script lang="ts">
	type Props = {
		command: string;
		label?: string;
		class?: string;
		size?: 'sm' | 'md';
	};

	let { command, label, class: className = '', size = 'md' }: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
		} catch {
			return;
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1600);
	}
</script>

<button
	type="button"
	onclick={copy}
	title="Copy “{command}”"
	class="group flex w-full items-center gap-2.5 border border-line bg-ink px-3 font-mono text-fog transition-colors hover:border-line-bright hover:text-chalk {size ===
	'sm'
		? 'h-8 text-[11px]'
		: 'h-10 text-xs'} {className}"
>
	<span class="shrink-0 text-gold/60 group-hover:text-gold">$</span>
	<span class="truncate text-left">
		{#if label}<span class="mr-2 text-fog-dim">{label}</span>{/if}{command}
	</span>
	<span class="ml-auto shrink-0 pl-2 text-[10px] tracking-[0.14em] uppercase {copied
		? 'text-jade'
		: 'text-fog-dim group-hover:text-fog'}">
		{copied ? 'copied' : 'copy'}
	</span>
</button>
