// https://vitejs.dev/guide/backend-integration.html

import { defineConfig } from 'vite';
import type {} from '@vavite/multibuild/vite-config';
import preact from '@preact/preset-vite';
import remixRoutes from 'vite-plugin-remix-routes';
import path from 'path';

// pnpm vavite

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  buildSteps: [
    {
      name: 'client',
      config: {
        build: {
          outDir: 'dist/client',
          manifest: true,
          rollupOptions: {
            input: 'src/entry-client.ts',
          },
        },
      },
    },
    {
      name: 'server',
      config: {
        build: {
          // Server entry
          ssr: 'src/entry-server.ts',
          outDir: 'dist/server',
          copyPublicDir: false,
        },
      },
    },
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  build: {
    // manifest: fileURLToPath(new URL('./lib/manifest.json', import.meta.url)),
    // ssrManifest: true,
    // emptyOutDir: false, // avoid issue with wrangler
  },
  ssr: {
    // target: 'webworker',
    noExternal: ['generouted'],
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'automatic',
        jsxImportSource: 'preact',
      },
      // exclude: ['generouted', 'generouted/react-router'],
    },
  },
  plugins: [
    preact(),
    remixRoutes({
      appDirectory: path.resolve('./src'),
      dataRouterCompatible: true,
    }),
  ],
});
