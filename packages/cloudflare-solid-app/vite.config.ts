import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    solid({
      adapter: 'solid-start-cloudflare-workers',
    }),
  ],
});
