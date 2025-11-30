import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Dein Backend-Server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/api/, ''),
      },
    },
  },
});
