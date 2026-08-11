import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        istanbul({
            include: ['app/**/*'],
            exclude: ['node_modules/**/*', 'cypress/**/*', 'build/**/*'],
            extension: ['.js', '.ts', '.jsx', '.tsx'],
            cypress: true,
            requireEnv: false,
        }),
    ],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./app', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
    },
    // Required by vite-plugin-istanbul for accurate coverage mapping
    build: { sourcemap: true },
});
