import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// App.js uses JSX, so tell Vite to treat .js files in src/ as JSX.
export default defineConfig({
  base: './',
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: 'jsx', include: /src\/.*\.js$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
});
