import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pichler-advisory.ch',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
