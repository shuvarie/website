import type { Element, Root, RootContent } from 'hast';
import type { PreprocessorGroup } from 'svelte/compiler';
import { visit } from 'unist-util-visit';

export type Heading = { depth: number; id: string; text: string };

/** The subset of a VFile this plugin touches. */
type FileLike = { data: Record<string, unknown> };

/**
 * mdsvex 0.12 renders a markdown file's frontmatter into the deprecated
 * `<script context="module">` block, which Svelte 5 warns about in favour of
 * `<script module>`. Rewrite it after mdsvex has run.
 *
 * This is anchored on the `export const metadata` declaration that mdsvex
 * always generates next to the tag, so a code sample pasted into a docs page
 * can never be mistaken for a real module script. Drop the preprocessor once
 * mdsvex 1.0 ships (it emits `<script module>` already).
 */
export function modernModuleScripts(): PreprocessorGroup {
	return {
		name: 'shuvarie:modern-module-scripts',
		markup({ content, filename }) {
			if (!filename || !/\.(md|svx)$/.test(filename)) return;

			const code = content.replace(
				/<script context="module">(\s*export const metadata = )/g,
				'<script module>$1'
			);

			return code === content ? undefined : { code };
		}
	};
}

/**
 * Collect the h2–h4 headings of a markdown file into its frontmatter, so each
 * docs page ships a table of contents without re-parsing the markdown in the
 * browser. Runs after `rehype-slug`, so the ids already exist.
 */
export function rehypeCollectHeadings() {
	return (tree: Root, file: FileLike) => {
		const headings: Heading[] = [];

		visit(tree, 'element', (node: Element) => {
			if (!/^h[234]$/.test(node.tagName)) return;
			const id = node.properties?.id;
			if (typeof id !== 'string') return;
			headings.push({
				depth: Number(node.tagName[1]),
				id,
				text: toText(node)
			});
		});

		const data = file.data as { fm?: Record<string, unknown> };
		data.fm = { ...(data.fm ?? {}), headings };
	};
}

function isAnchorMark(node: Element): boolean {
	const className = node.properties?.className;
	const classes = (Array.isArray(className) ? className : [className]).map(String);
	return node.tagName === 'span' && classes.includes('anchor-mark');
}

function toText(node: RootContent): string {
	if (node.type === 'text') return node.value;
	if (node.type === 'element') {
		if (isAnchorMark(node)) return '';
		return node.children.map(toText).join('');
	}
	return 'children' in node ? (node.children as RootContent[]).map(toText).join('') : '';
}
