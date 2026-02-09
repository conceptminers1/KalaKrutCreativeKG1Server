import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Extract the public host from the Cloud Workstation URL if it exists
    const hmrHost = env.VITE_APP_HMR_HOST || '9000-firebase-kalakrutcreativekg1-1769075240619.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev';

    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: {
            // The public URL of the HMR client
            host: hmrHost,
            // The port the HMR client should connect to (443 for HTTPS)
            clientPort: 443,
            // Use 'wss' for secure websockets
            protocol: 'wss',
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
