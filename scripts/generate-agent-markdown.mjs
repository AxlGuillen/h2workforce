// Post-build step: generate a Markdown sibling (`<file>.html.md`) for every
// content page in `dist/`. A Netlify Edge Function serves these when an agent
// requests `Accept: text/markdown` (see netlify/edge-functions/markdown.ts).
//
// Runs automatically after `npm run build` via the `postbuild` npm lifecycle.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

const DIST = 'dist';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});

// Drop decorative / non-content elements before converting.
turndown.remove(['script', 'style', 'noscript', 'form', 'button', 'svg', 'iframe']);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const htmlFiles = await walk(DIST);
let written = 0;

for (const file of htmlFiles) {
  const rel = file.replaceAll('\\', '/');

  // Skip the CMS admin app and the root redirect stub (no real content).
  if (rel.includes('/decapcms/')) continue;

  const html = await readFile(file, 'utf8');
  const root = parse(html, { comment: false });

  // Only convert the main content region; fall back to <article>.
  const main = root.querySelector('main') || root.querySelector('article');
  if (!main) continue; // redirect stubs and chromeless pages -> serve HTML instead

  const title = root.querySelector('title')?.text?.trim() ?? '';

  let markdown = turndown.turndown(main.innerHTML);
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
  if (!markdown) continue;

  // Prepend the page title as an H1 only if the content has no top-level heading of its own.
  const hasH1 = /^# .+/m.test(markdown);
  if (title && !hasH1) {
    markdown = `# ${title}\n\n${markdown}`;
  }
  markdown += '\n';

  await writeFile(`${file}.md`, markdown, 'utf8');
  written++;
}

console.log(`[markdown-for-agents] wrote ${written} markdown file(s) alongside HTML`);
