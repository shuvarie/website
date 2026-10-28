<script lang="ts">
	import { page } from '$app/state';
	import NotFound from '#lib/components/NotFound.svelte';
</script>

<svelte:head>
	<title>{page.status} — Shuvarie</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<NotFound
	status={page.status}
	message={page.error?.message ?? 'The quest could not be found.'}
	path={page.url.pathname}
/>
