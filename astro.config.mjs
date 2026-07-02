import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pichler-advisory.ch',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) =>
        !page.includes('/login') &&
        !page.includes('/impressum') &&
        !page.includes('/agb') &&
        !page.includes('/datenschutz') &&
        !page.includes('/404'),
    }),
  ],
});
