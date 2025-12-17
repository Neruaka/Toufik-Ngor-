import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',  // Important pour Docker
    watch: {
      usePolling: true  // Nécessaire pour le hot reload dans Docker
    }
  }
})