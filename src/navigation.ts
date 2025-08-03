/* import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks'; */
import { getPermalink } from './utils/permalinks';


export const getHeaderData = (lang: 'en' | 'es') => ({
  links: [
    {
      text: lang === 'es' ? 'Inicio' : 'Home',
      href: getPermalink('/', 'page', lang),
    },
    {
      text: lang === 'es' ? 'Sobre nosotros' : 'About us',
      href: getPermalink('/about', 'page', lang),
    },
    {
      text: 'Blog',
      href: getPermalink('/blog', 'blog', lang),
    },
  ],
  actions: [
    {
      text: lang === 'es' ? 'Contáctanos' : 'Contact Us',
      href: 'mailto:ceo@h2-workforce.com',
      target: '_blank',
    },
  ],
});

export const getFooterData = (lang: 'en' | 'es') => ({
  links: [],
  secondaryLinks: [
    {
      text: lang === 'es' ? 'Términos' : 'Terms',
      href: getPermalink('/terms', 'page', lang),
    },
    {
      text: lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy',
      href: getPermalink('/privacy', 'page', lang),
    },
  ],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/H2WorkForceOficial?rdid=ihAWB0ukMhxhnqoK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16NThM6HEp%2F#',
    },
  ],
  footNote:
    lang === 'es'
      ? '© 2025 H2WorkForce - Todos los derechos reservados.'
      : '© 2025 H2WorkForce - All rights reserved.',
});
