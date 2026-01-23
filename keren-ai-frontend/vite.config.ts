import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
      port: 4173,
      strictPort: true,
      host: '0.0.0.0',
      cors: true, // Enables CORS for Preview mode
      headers: {
        "Access-Control-Allow-Origin": "*", // The "Permission Slip"
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        embed: resolve(__dirname, 'embed.html'),
        // Script-injected widget entry (no iframe)
        widget: resolve(__dirname, 'src/widget-entry.tsx'),
      },
      output: {
        // Stable filenames so the loader can reference them.
        entryFileNames: (chunk) => {
          if (chunk.name === 'widget') return 'assets/widget-entry.js';
          return 'assets/[name].js';
        },
        assetFileNames: (assetInfo) => {
          // Keep a stable CSS name for the widget.
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/widget.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
