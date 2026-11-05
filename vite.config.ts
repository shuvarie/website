import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { codeToHtml } from 'shiki';
import { defineConfig } from 'vite';
import { modernModuleScripts, rehypeCollectHeadings } from './mdx-plugins.ts';

const LANGS = [
	'bash',
	'shell',
	'sh',
	'console',
	'json',
	'yaml',
	'toml',
	'rust',
	'ts',
	'js',
	'svelte',
	'markdown',
	'diff',
	'html',
	'css',
	'text'
];

/** Neutralise anything Svelte would try to execute inside our `{@html}`. */
const escapeSvelte = (html: string) =>
	html.replace(/[{}`]/g, (c) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' })[c as '}']);

/**
 * mdsvex is Svelte's take on MDX: markdown becomes a Svelte component, so a
 * docs page can import components and use `{expressions}` inline, while every
 * fenced block is highlighted by Shiki at build time — no highlighter ships to
 * the browser.
 */
const mdx = mdsvex({
	extensions: ['.md', '.svx'],
	smartypants: { dashes: 'oldschool' },
	remarkPlugins: [remarkGfm],
	// mdsvex bundles its own copy of unified, so its `Plugin`/`Node` types are
	// nominally distinct from the ones the plugins below are typed against. The
	// runtime shapes agree; this one cast keeps the boundary honest.
	rehypePlugins: [
		rehypeSlug,
		rehypeCollectHeadings,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'append',
				properties: { className: ['heading-anchor'], ariaHidden: true, tabIndex: -1 },
				content: {
					type: 'element',
					tagName: 'span',
					properties: { className: ['anchor-mark'] },
					children: [{ type: 'text', value: '#' }]
				}
			}
		]
	] as any,
	highlight: {
		highlighter: async (code, lang) => {
			const language = lang && LANGS.includes(lang) ? lang : 'text';
			const html = await codeToHtml(code.replace(/\n$/, ''), {
				lang: language,
				theme: 'vitesse-dark'
			});
			// `html` nodes are spliced into the generated Svelte verbatim, so the
			// markup travels inside a template literal that the compiler renders.
			return `{@html \`${escapeSvelte(html)}\`}`;
		}
	}
});

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: [mdx, modernModuleScripts()],
			extensions: ['.svelte', '.md', '.svx'],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: { entries: ['*'], handleHttpError: 'warn' }
		})
	]
});
