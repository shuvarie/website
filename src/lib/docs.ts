import type { Component } from 'svelte';

export type Heading = { depth: number; id: string; text: string };

export type DocMeta = {
	title: string;
	description?: string;
	group?: string;
	order?: number;
	headings?: Heading[];
};

export type DocModule = { default: Component; metadata: DocMeta };

export type Doc = DocMeta & {
	slug: string;
	href: string;
	component: Component;
};

const modules = import.meta.glob<DocModule>('/src/content/docs/**/*.md', { eager: true });

export const docs: Doc[] = Object.entries(modules)
	.map(([file, module]) => {
		const slug = file.replace('/src/content/docs/', '').replace(/\.md$/, '');
		return {
			...module.metadata,
			title: module.metadata.title ?? slug,
			slug,
			href: `/docs/${slug}`,
			component: module.default
		};
	})
	.sort((a, b) => a.slug.localeCompare(b.slug));

export const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

export type NavGroup = { title: string; items: Doc[] };

/** Sidebar order; any group not listed falls to the end in content order. */
const GROUP_ORDER = ['Getting started', 'Usage', 'Configuration', 'Docs'];

/** Sidebar structure, derived from `group` + `order` in each file's frontmatter. */
export const navGroups: NavGroup[] = docs
	.reduce<NavGroup[]>((groups, doc) => {
		const title = doc.group ?? 'Docs';
		let group = groups.find((candidate) => candidate.title === title);
		if (!group) {
			group = { title, items: [] };
			groups.push(group);
		}
		group.items.push(doc);
		return groups;
	}, [])
	.map((group) => ({
		...group,
		items: group.items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
	}))
	.sort((a, b) => {
		const ai = GROUP_ORDER.indexOf(a.title);
		const bi = GROUP_ORDER.indexOf(b.title);
		return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
	});

/** Reading order across the whole docs set, used for prev/next. */
export const flatDocs = navGroups.flatMap((group) => group.items);

export function getDoc(slug: string): Doc | undefined {
	return bySlug.get(slug);
}

export function getNeighbours(slug: string): { prev?: Doc; next?: Doc } {
	const index = flatDocs.findIndex((doc) => doc.slug === slug);
	if (index === -1) return {};
	return { prev: flatDocs[index - 1], next: flatDocs[index + 1] };
}

export function getGroup(slug: string): NavGroup | undefined {
	return navGroups.find((group) => group.items.some((doc) => doc.slug === slug));
}
