// https://vitejs.dev/guide/backend-integration.html

import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
// import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  build: {
    // manifest: fileURLToPath(new URL('./lib/manifest.json', import.meta.url)),
    manifest: true,
    // ssrManifest: true,
    rollupOptions: {
      input: 'src/main.ts',
    },
    emptyOutDir: false, // avoid issue with wrangler
  },
});
