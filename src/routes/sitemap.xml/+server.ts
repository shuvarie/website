import { docs } from '#lib/docs';

export const prerender = true;

const ORIGIN = 'https://shuvarie.org';

/** Every prerendered page: the landing page, about, the manual index and docs. */
const PATHS = ['/', '/about', '/docs', ...docs.map((doc) => doc.href)];

export const GET = () => {
	const urls = PATHS.map((path) => `\t<url>\n\t\t<loc>${ORIGIN}${path}</loc>\n\t</url>`).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
