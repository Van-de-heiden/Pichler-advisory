import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pichleradvisory.ch',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
