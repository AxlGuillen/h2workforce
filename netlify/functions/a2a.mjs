// Minimal, real A2A (Agent-to-Agent) endpoint for the H2WorkForce Info Agent.
//
// Speaks A2A over JSON-RPC 2.0. Its agent card is served statically at
// /.well-known/agent-card.json and points here. The agent answers questions
// about H2WorkForce from a fixed, first-party knowledge base (no LLM), so every
// response is accurate and honest.

import { randomUUID } from 'node:crypto';

const SITE = {
  name: 'H2WorkForce',
  url: 'https://h2workforce.com',
  contactEmail: 'ceo@h2-workforce.com',
  facebook: 'https://www.facebook.com/H2WorkForceOficial',
  countries: ['United States', 'Canada'],
  programs: ['H-2A (temporary agricultural)', 'H-2B (temporary non-agricultural)'],
  sectors: ['Agriculture', 'Livestock', 'Construction', 'Healthcare', 'Professional services'],
  description:
    'H2WorkForce is a binational firm specializing in the legal and ethical recruitment of temporary international workers, connecting Mexican workers with employers in the United States and Canada through federally regulated H-2 processes.',
};

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
  });

const rpcError = (id, code, message) => json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

/** Build the plain-text answer from the agent's first-party knowledge base. */
function answer(userText) {
  const q = (userText || '').toLowerCase();

  if (/(contact|email|reach|phone|contact.*|correo|contacto|tel)/.test(q)) {
    return [
      `Contact ${SITE.name}:`,
      `- Email: ${SITE.contactEmail} (primary channel to request workers or start an H-2A/H-2B hiring process)`,
      `- Facebook: ${SITE.facebook}`,
      `- Website: ${SITE.url}`,
    ].join('\n');
  }

  if (/(sector|industr|field|rubro|giro)/.test(q)) {
    return `${SITE.name} recruits temporary workers for: ${SITE.sectors.join(', ')}.`;
  }

  if (/(program|visa|h-?2|h2)/.test(q)) {
    return `${SITE.name} handles the following U.S. temporary work visa programs: ${SITE.programs.join(
      ' and '
    )}. It serves employers in ${SITE.countries.join(' and ')}.`;
  }

  // Default: overview + how to go deeper.
  return [
    SITE.description,
    ``,
    `Programs: ${SITE.programs.join(' and ')}.`,
    `Sectors: ${SITE.sectors.join(', ')}.`,
    `Countries: ${SITE.countries.join(' and ')}.`,
    `Contact: ${SITE.contactEmail} · ${SITE.url}`,
  ].join('\n');
}

/** Extract the concatenated text of an A2A message's parts. */
function textFromMessage(message) {
  if (!message || !Array.isArray(message.parts)) return '';
  return message.parts
    .filter((p) => p && (p.kind === 'text' || typeof p.text === 'string'))
    .map((p) => p.text || '')
    .join(' ')
    .trim();
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return rpcError(null, -32600, 'A2A endpoint expects JSON-RPC 2.0 POST requests.');
  }

  let rpc;
  try {
    rpc = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error: request body is not valid JSON.');
  }

  if (!rpc || rpc.jsonrpc !== '2.0' || typeof rpc.method !== 'string') {
    return rpcError(rpc?.id, -32600, 'Invalid Request: expected JSON-RPC 2.0 with a method.');
  }

  switch (rpc.method) {
    case 'message/send': {
      const userText = textFromMessage(rpc.params?.message);
      const result = {
        kind: 'message',
        role: 'agent',
        messageId: randomUUID(),
        parts: [{ kind: 'text', text: answer(userText) }],
      };
      return json({ jsonrpc: '2.0', id: rpc.id ?? null, result });
    }
    default:
      return rpcError(rpc.id, -32601, `Method not found: ${rpc.method}. This agent supports "message/send".`);
  }
};

export const config = { path: '/a2a' };
