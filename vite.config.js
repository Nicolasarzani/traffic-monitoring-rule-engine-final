import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// For GitHub Pages project sites, CI sets SITE_BASE to /repo-name/ (see .github/workflows).
export default defineConfig({
  base: process.env.SITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
