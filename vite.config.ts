import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';

const coverageOn =
    process.env.CYPRESS_COVERAGE === 'true' || process.env.VITE_COVERAGE === 'true';

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        istanbul({
            include: ['app/**/*'],
            exclude: ['node_modules/**/*', 'cypress/**/*', 'build/**/*'],
            extension: ['.js', '.ts', '.jsx', '.tsx'],
            cypress: true,
            requireEnv: true,
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
    // Pre-bundle MSW so the first Cypress visit does not trigger
    // "[vite] optimized dependencies changed. reloading"
    optimizeDeps: {
        include: ['msw', 'msw/browser', 'msw/node'],
    },
    // Only enable sourcemaps for coverage runs — never in normal production builds
    build: { sourcemap: coverageOn },
});
