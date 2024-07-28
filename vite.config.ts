import { defineConfig } from 'vite';
import type {} from '@vavite/multibuild';
import preact from '@vitejs/plugin-react';
import remixRoutes from 'vite-plugin-remix-routes';
import path from 'node:path';

// pnpm vavite
// https://vitejs.dev/guide/backend-integration.html

// https://vitejs.dev/config/
export default defineConfig({
  buildSteps: [
    {
      name: 'client',
      config: {},
    },
    {
      name: 'server',
      config: {
        build: {
          ssr: true,
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
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'automatic',
        jsxImportSource: 'preact',
      },
    },
  },
  plugins: [
    preact(),
    remixRoutes({
      appDirectory: path.resolve('./src'),
      dataRouterCompatible: true,
    }),
    {
      name: 'app-config',
      config(config, env) {
        if (env.isSsrBuild) {
          return {
            build: {
              emptyOutDir: false,
              rollupOptions: {
                input: 'src/entry-server.ts',
              },
              outDir: 'dist/server',
              copyPublicDir: false,
            },
          };
        } else {
          return {
            build: {
              emptyOutDir: false,

              outDir: 'dist/client',
              manifest: true,
              rollupOptions: {
                input: 'src/entry-client.ts',
              },
            },
          };
        }
      },
    },
  ],
});
