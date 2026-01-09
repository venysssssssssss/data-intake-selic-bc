import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mvp1-dataintake/',
  server: {
    proxy: {
      '/v1': 'http://localhost:8000'
    }
  }
})
