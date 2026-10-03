import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * @file vite.config.ts
 * @description Vite configuration file for the React PWA frontend.
 * Includes React plugins, path aliases for clean imports, and Docker-compatible server settings.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map the '@' prefix to the 'src' directory to avoid relative path hell (e.g., ../../../components)
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Bind to all network interfaces to allow external access (essential for Docker containerization)
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Fail immediately if port 5173 is already in use
  },
});