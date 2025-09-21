import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
   
  build: {
    chunkSizeWarningLimit: 1000, // Default is 500 KB, this sets it to 1 MB
  },
})
