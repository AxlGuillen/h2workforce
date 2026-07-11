// Markdown for Agents: content negotiation on the same URL.
//
// When a request carries `Accept: text/markdown`, serve the pre-generated
// Markdown sibling of the page (built by scripts/generate-agent-markdown.mjs)
// with `Content-Type: text/markdown`. Browsers and other clients keep getting
// the normal HTML response untouched.

import type { Context, Config } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  const accept = request.headers.get('accept')?.toLowerCase() ?? '';
  if (!accept.includes('text/markdown')) {
    return; // Not an agent asking for markdown -> serve HTML as usual.
  }

  const url = new URL(request.url);
  let pathname = url.pathname;

  // Map the request path to the static HTML file it resolves to.
  if (pathname === '/') {
    pathname = '/en/index.html'; // root redirects to the English home
  } else {
    if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    const last = pathname.split('/').pop() ?? '';
    if (!last.includes('.')) pathname += '/index.html';
  }

  // Fetch the pre-built markdown sibling. `Accept: text/plain` guarantees this
  // sub-request is never itself rewritten to markdown.
  const mdUrl = new URL(`${pathname}.md`, url.origin);
  const res = await fetch(mdUrl, { headers: { accept: 'text/plain' } });
  if (!res.ok) {
    return; // No markdown available for this route -> fall back to HTML.
  }

  const body = await res.text();
  const tokens = Math.ceil(body.length / 4); // rough token estimate

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
      vary: 'Accept',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
};

export const config: Config = {
  path: '/*',
  excludedPath: [
    '/_astro/*',
    '/decapcms/*',
    '/.well-known/*',
    '/a2a',
    '/*.js',
    '/*.css',
    '/*.xml',
    '/*.txt',
    '/*.md',
    '/*.json',
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.webp',
    '/*.svg',
    '/*.ico',
    '/*.gif',
    '/*.avif',
    '/*.woff',
    '/*.woff2',
  ],
};
