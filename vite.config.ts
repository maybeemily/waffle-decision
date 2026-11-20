import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base matches the GitHub Pages project URL: https://<user>.github.io/waffle-decision/
export default defineConfig({
  base: '/waffle-decision/',
  plugins: [react()],
})
