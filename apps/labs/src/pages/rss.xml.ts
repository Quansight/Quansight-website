import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const siteUrl =
    site?.toString().replace(/\/$/, '') ?? 'https://labs.quansight.org';

  const allPosts = await getCollection('posts');
  const posts = allPosts
    .filter((p) => p.data.published)
    .sort(
      (a, b) =>
        new Date(b.data.published).getTime() -
        new Date(a.data.published).getTime(),
    );

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.id}`;
      const pubDate = new Date(post.data.published).toUTCString();
      const title = escape(post.data.title ?? '');
      const description = escape(post.data.description ?? '');
      const imageUrl = post.data.featuredImage?.src
        ? escape(`${siteUrl}${post.data.featuredImage.src}`)
        : null;
      return `    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Quansight Labs</title>
    <description>This is an RSS feed. To subscribe to it, copy its address and paste it when your feed reader asks for it. It will be updated periodically in your reader.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <copyright>All rights reserved ${new Date().getFullYear()}, Quansight</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
