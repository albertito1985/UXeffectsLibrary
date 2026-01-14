import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Config for building the demo/examples app
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: resolve(__dirname, 'examples/index.html')
    }
  }
})
