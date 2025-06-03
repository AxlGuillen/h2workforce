/* import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks'; */
import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Start',
      href: getPermalink('/#hero'),
    },
    {
      text: 'Pillars',
      href: getPermalink('/#pillars'),
    },
    {
      text: 'Services',
      href: getPermalink('/#services'),
    },
    {
      text: 'Steps',
      href: getPermalink('/#steps'),
    },
    {
      text: 'FAQs',
      href: getPermalink('/#faqs'),
    },
    {
      text: 'About us',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'Contact Us', href: 'mailto:ceo@h2-workforce.com', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      text: 'Home',
      links: [
        {
          text: 'Start',
          href: getPermalink('/#hero'),
        },
        {
          text: 'Pillars',
          href: getPermalink('/#pillars'),
        },
        {
          text: 'Services',
          href: getPermalink('/#services'),
        },
        {
          text: 'Steps',
          href: getPermalink('/#steps'),
        },
        {
          text: 'FAQs',
          href: getPermalink('/#faqs'),
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/H2WorkForceOficial?rdid=ihAWB0ukMhxhnqoK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16NThM6HEp%2F#',
    },
  ],
  footNote: `
    © 2025 H2WorkForce - All rights reserved.
  `,
};
