import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path must match the repository name for GitHub Pages
  base: '/mvp1-dataintake/', 
  server: {
    proxy: {
      '/v1': 'http://localhost:8000'
    }
  }
})
