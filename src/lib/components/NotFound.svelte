<script lang="ts">
	type Props = { status?: number; message?: string; path?: string };

	let { status = 404, message = 'The quest could not be found.', path = '' }: Props = $props();
</script>

<div class="relative overflow-hidden">
	<div class="pointer-events-none absolute inset-0 bg-grid opacity-50"></div>
	<div class="relative mx-auto flex w-full max-w-2xl flex-col items-start px-5 py-24 sm:px-8">
		<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// error</p>
		<h1 class="mt-3 font-mono text-5xl font-semibold tracking-tight text-chalk">{status}</h1>
		<p class="mt-3 font-mono text-sm text-fog">{message}</p>
		<pre
			class="mt-6 w-full overflow-x-auto border border-line bg-ink p-4 font-mono text-[11px] text-fog-dim"><code>shuvarie: no such route
+  at {path || '/'}
  hint: try <span class="text-gold-soft">/docs</span> or <span class="text-gold-soft">/</span></code></pre>
		<div class="mt-8 flex gap-3 font-mono text-xs">
			<a href="/" class="border border-gold/70 bg-gold px-3 py-1.5 text-void hover:bg-gold-soft"
				>home</a
			>
			<a
				href="/docs"
				class="border border-line-bright bg-panel px-3 py-1.5 text-chalk hover:bg-panel-2">docs</a
			>
		</div>
	</div>
</div>
