import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../extensions/chatbot-ext/assets'),
    assetsDir: '.', // Avoid creating a subfolder for assets; place them directly in 'assets'
    rollupOptions: {
      output: {
        entryFileNames: 'theme-extension.js', // Main JavaScript file
        assetFileNames: '[name].[ext]', // Keep asset names simple
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
