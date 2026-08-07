import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves this app from https://<user>.github.io/trax/, not
  // the domain root, so the production build needs that base path baked in.
  // `vite preview` serves that same built output, so it needs it too — only
  // the dev server (`vite`) should stay at '/', or localhost:5174/ would 404.
  base: command === 'build' || isPreview ? '/trax/' : '/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
}))
