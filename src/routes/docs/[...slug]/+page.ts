import { error } from '@sveltejs/kit';
import { docs, getDoc, getGroup, getNeighbours } from '#lib/docs';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => docs.map((doc) => ({ slug: doc.slug }));

export const load: PageLoad = ({ params }) => {
	const doc = getDoc(params.slug);
	if (!doc) error(404, `No page at /docs/${params.slug}`);

	const { prev, next } = getNeighbours(doc.slug);

	return {
		doc,
		group: getGroup(doc.slug)?.title ?? 'Docs',
		prev: prev ? { title: prev.title, href: prev.href } : null,
		next: next ? { title: next.title, href: next.href } : null
	};
};
