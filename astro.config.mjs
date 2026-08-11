import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://salvadorsanchez.dev',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  },
});