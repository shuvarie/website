// Ambient module types for markdown compiled by mdsvex. This file has no
// top-level import/export on purpose: a declaration file that is a module can
// only *augment* modules, so the `*.md` wildcard would be ignored.
declare module '*.md' {
	import type { Component } from 'svelte';
	import type { DocMeta } from '#lib/docs';

	/** Frontmatter, exposed by mdsvex; `headings` is added by our rehype plugin. */
	export const metadata: DocMeta;
	const component: Component;
	export default component;
}
