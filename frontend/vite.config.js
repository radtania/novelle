import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/books': 'http://localhost:8080',
      '/recommendations': 'http://localhost:8080',
      '/profile': 'http://localhost:8080',
    }
  }
})