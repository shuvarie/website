import type { PageLoad } from './$types';
import About, { metadata } from '../../content/about.md';

export const prerender = true;

export const load: PageLoad = () => ({ metadata, component: About });
