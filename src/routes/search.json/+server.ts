import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

const raw = import.meta.glob<string>('/src/content/docs/**/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

/** Strip markdown down to something worth searching. */
function toPlainText(markdown: string) {
	return markdown
		.replace(/^---[\s\S]*?---\n/, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#>*_`|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function meta(markdown: string, key: string) {
	const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	const line = frontmatter.split('\n').find((entry) => entry.startsWith(`${key}:`));
	return line ? line.slice(key.length + 1).trim().replace(/^"|"$/g, '') : '';
}

export const GET: RequestHandler = () => {
	const entries = Object.entries(raw)
		.map(([file, source]) => {
			const slug = file.replace('/src/content/docs/', '').replace(/\.md$/, '');
			return {
				slug,
				title: meta(source, 'title') || slug,
				group: meta(source, 'group') || 'Docs',
				text: toPlainText(source)
			};
		})
		.sort((a, b) => a.slug.localeCompare(b.slug));

	return json(entries);
};
