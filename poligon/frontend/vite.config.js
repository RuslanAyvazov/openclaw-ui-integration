import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // WSL2: listen on all interfaces so the Windows browser can reach the server;
        // usePolling — file events from /mnt/* (Windows drive) don't propagate to inotify.
        host: true,
        port: 5173,
        watch: {
            usePolling: true
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true
            }
        }
    }
});
