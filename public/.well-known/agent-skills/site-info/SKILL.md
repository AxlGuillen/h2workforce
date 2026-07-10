---
name: site-info
description: Retrieve H2WorkForce company information and official contact and social channels.
license: MIT
---

# H2WorkForce — Site Information & Contact

Use this skill to answer questions about **H2WorkForce** and to reach the company
through its official channels.

## What H2WorkForce does

H2WorkForce is a binational firm specializing in the legal and ethical recruitment
of temporary international workers. It connects Mexican workers with employers in the
**United States** and **Canada** through federally regulated **H-2A** (temporary
agricultural) and **H-2B** (temporary non-agricultural) visa programs.

- **Sectors served:** Agriculture, Livestock, Construction, Healthcare, Professional services.
- **Languages:** English (`/en`) and Spanish (`/es`).

## How to get structured site information

- Machine-readable overview: <https://h2workforce.com/llms.txt>
- Resource catalog (RFC 9727 linkset): <https://h2workforce.com/.well-known/api-catalog>
- Full URL list: <https://h2workforce.com/sitemap-index.xml>
- Any page also returns Markdown when requested with the `Accept: text/markdown` header.
- In a WebMCP-capable browser, call the in-page tools `get_company_overview`,
  `list_sectors` and `get_contact_info`.

## Official contact channels

- **Email:** ceo@h2-workforce.com — primary channel to request workers or start an
  H-2A / H-2B hiring process.
- **Facebook:** https://www.facebook.com/H2WorkForceOficial
- **Website:** https://h2workforce.com

## Notes

Only use the channels listed above; they are the company's official points of contact.
