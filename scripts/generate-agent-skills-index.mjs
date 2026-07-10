// Post-build step: generate the Agent Skills discovery index
// (/.well-known/agent-skills/index.json, Agent Skills Discovery RFC v0.2.0).
//
// Scans dist/.well-known/agent-skills/<name>/SKILL.md, computes each file's
// SHA-256 over the exact bytes that get served, and writes index.json. Doing
// this at build time keeps the digests correct regardless of line-ending
// normalization between platforms.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const BASE = 'dist/.well-known/agent-skills';

function parseDescription(md) {
  const front = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!front) return '';
  const line = front[1].split(/\r?\n/).find((l) => l.startsWith('description:'));
  return line ? line.slice('description:'.length).trim().replace(/^["']|["']$/g, '') : '';
}

let dirents;
try {
  dirents = await readdir(BASE, { withFileTypes: true });
} catch {
  console.log('[agent-skills] no agent-skills directory; index.json not written');
  process.exit(0);
}

const skills = [];
for (const dirent of dirents) {
  if (!dirent.isDirectory()) continue;
  const skillPath = join(BASE, dirent.name, 'SKILL.md');
  let bytes;
  try {
    bytes = await readFile(skillPath);
  } catch {
    continue; // no SKILL.md in this folder
  }
  const digest = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
  skills.push({
    name: dirent.name,
    type: 'skill-md',
    description: parseDescription(bytes.toString('utf8')),
    url: `/.well-known/agent-skills/${dirent.name}/SKILL.md`,
    digest,
  });
}

if (!skills.length) {
  console.log('[agent-skills] no SKILL.md files found; index.json not written');
  process.exit(0);
}

skills.sort((a, b) => a.name.localeCompare(b.name));

const index = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills,
};

await writeFile(join(BASE, 'index.json'), JSON.stringify(index, null, 2) + '\n', 'utf8');
console.log(`[agent-skills] wrote index.json with ${skills.length} skill(s)`);
