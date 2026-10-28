<script lang="ts">
	type Props = { class?: string };
	let { class: className = '' }: Props = $props();
</script>

<div class="panel relative overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] {className}">
	<!-- title bar -->
	<div
		class="flex items-center gap-2 border-b border-line bg-panel-2/60 px-3 py-2 font-mono text-2xs text-fog-dim"
	>
		<span class="flex gap-1.5">
			<span class="size-2 rounded-full bg-ember/70"></span>
			<span class="size-2 rounded-full bg-gold/70"></span>
			<span class="size-2 rounded-full bg-jade/70"></span>
		</span>
		<span class="ml-2 text-fog">shuvarie</span>
		<span class="opacity-40">—</span>
		<span class="truncate">~/src/shuvarie — 132×43</span>
		<span class="ml-auto hidden items-center gap-2 sm:flex">
			<span class="text-gold/70">faerun</span>
			<span class="opacity-40">·</span>
			<span>session 7c1e</span>
		</span>
	</div>

	<!-- transcript -->
	<div class="space-y-3 px-4 py-4 font-mono text-[11.5px] leading-relaxed sm:text-xs">
		<div class="flex items-center gap-2 text-2xs text-fog-dim">
			<span class="text-gold">⚔</span>
			<span>shuvarie</span>
			<span class="opacity-40">/</span>
			<span>anthropic/claude-sonnet-4-5</span>
			<span class="text-gold/70">(plan)</span>
		</div>

		<div class="flex gap-2">
			<span class="text-gold">❯</span>
			<span class="text-chalk">add a --dry-run flag to <span class="text-ice">export</span></span>
		</div>

		<div class="flex gap-2">
			<span class="text-gold">⏺</span>
			<span class="text-fog">Reading the export path before touching it.</span>
		</div>

		<div class="space-y-1 pl-5 text-fog">
			<div class="flex items-baseline gap-2">
				<span class="text-fog-dim">├</span>
				<span class="text-gold-soft">grep</span>
				<span class="truncate text-chalk/80">"fn export" src/cli</span>
				<span class="ml-auto shrink-0 text-jade/80">3 hits</span>
				<span class="w-14 shrink-0 text-right text-fog-dim">12ms</span>
			</div>
			<div class="flex items-baseline gap-2">
				<span class="text-fog-dim">├</span>
				<span class="text-gold-soft">read_file</span>
				<span class="truncate text-chalk/80">src/cli/export.rs</span>
				<span class="ml-auto shrink-0 text-jade/80">✓</span>
				<span class="w-14 shrink-0 text-right text-fog-dim">4ms</span>
			</div>
			<div class="flex items-baseline gap-2">
				<span class="text-fog-dim">├</span>
				<span class="text-gold-soft">edit_file</span>
				<span class="truncate text-chalk/80">src/cli/export.rs</span>
				<span class="ml-auto shrink-0 text-jade">+18</span>
				<span class="shrink-0 text-ember">−3</span>
				<span class="w-14 shrink-0 text-right text-fog-dim">9ms</span>
			</div>
			<div class="flex items-baseline gap-2">
				<span class="text-fog-dim">└</span>
				<span class="text-fog">permission</span>
				<span class="truncate text-chalk/60">write · src/cli/export.rs</span>
				<span class="ml-auto shrink-0 text-jade">allow once</span>
				<span class="w-14 shrink-0"></span>
			</div>
		</div>

		<div class="ml-5 space-y-px border-l border-line pl-3 text-[11px] sm:text-[11.5px]">
			<div class="text-ember/90">
				<span class="mr-2 opacity-60">-</span>if dest.is_empty() &#123;
			</div>
			<div class="text-jade/90">
				<span class="mr-2 opacity-60">+</span>if dest.is_empty() &amp;&amp; !args.dry_run &#123;
			</div>
		</div>

		<div class="flex items-center gap-2 pt-1 text-2xs text-fog-dim">
			<span class="text-jade">▸</span>
			<span>3 tools · 2.4s · 4.1k tokens · turn committed</span>
		</div>

		<div class="flex items-center gap-2 pt-2">
			<span class="text-gold">❯</span>
			<span class="caret inline-block h-3.5 w-1.5 translate-y-0.5 bg-gold/80"></span>
		</div>
	</div>
</div>

<style>
	.caret {
		animation: blink 1.1s steps(2, start) infinite;
	}

	@keyframes blink {
		to {
			visibility: hidden;
		}
	}
</style>
