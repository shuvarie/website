<script lang="ts">
	import Mark from './Mark.svelte';

	const links = [
		{ href: '/docs', label: 'docs' },
		{ href: '/about', label: 'about' }
	];

	const repo = 'https://github.com/shuvarie/shuvarie';
</script>

<header class="sticky top-0 z-40 border-b border-line/80 bg-void/80 backdrop-blur-md">
	<div class="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
		<a href="/" class="flex items-center gap-2.5 text-chalk" aria-label="Shuvarie home">
			<Mark />
			<span class="font-mono text-[13px] font-medium tracking-tight">shuvarie</span>
		</a>

		<nav class="ml-auto flex items-center gap-1 font-mono text-xs">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="px-2.5 py-1.5 text-fog transition-colors hover:text-chalk"><span class="text-gold/50"
						>/</span
					>{link.label}</a
				>
			{/each}
			<a
				href={repo}
				target="_blank"
				rel="noreferrer"
				class="px-2.5 py-1.5 text-fog transition-colors hover:text-chalk"
			>
				<span class="text-gold/50">&gt;</span>github
			</a>
			<a
				href="/docs/install"
				class="ml-2 hidden items-center gap-2 border border-line-bright bg-panel px-3 py-1.5 text-chalk transition-colors hover:border-gold/50 hover:bg-panel-2 sm:flex"
			>
				<span class="size-1 rounded-full bg-jade"></span>
				install
			</a>
		</nav>
	</div>
</header>
