import react from '@vitejs/plugin-react';
import { cheminfoBuildInfo } from 'react-cheminfo/vite';
import { defineConfig } from 'vite';

import { siteFiles } from './vite.siteFiles.ts';

// Derived from the project creation date (2026-04-22); the dev server sits
// one port above the backend so a single value drives both.
const backendPort = Number(process.env.PORT ?? 10422);
const devServerPort = Number(process.env.VITE_PORT ?? backendPort + 1);

export default defineConfig({
  // The build carries no mount path. Every asset is written relative, so the
  // one `dist` serves the site's own host and a path of a shared one without
  // being rebuilt: the `<base>` the container stamps in at startup is what
  // resolves them, and the page reads its mount back off that.
  base: './',
  plugins: [react(), cheminfoBuildInfo(), siteFiles()],
  build: {
    target: 'esnext',
  },
  server: {
    port: devServerPort,
    // Fail loudly instead of drifting to the next free port, which would leave
    // the proxy target, the dev script and the README disagreeing.
    strictPort: true,
    // Everything the backend answers, so a dev run reaches the same addresses
    // the deployed site does: the renderer, and the Swagger UI the API entry of
    // the header points at — `/docs` covers its assets under `/docs/static`.
    proxy: {
      '/v1': `http://localhost:${backendPort}`,
      '/docs': `http://localhost:${backendPort}`,
    },
  },
});
