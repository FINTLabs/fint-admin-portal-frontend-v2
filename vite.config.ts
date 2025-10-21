import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';

// optional: enable sourcemaps only when you want coverage
const coverageOn = process.env.CYPRESS_COVERAGE === 'true' || process.env.VITE_COVERAGE === 'true';

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        tsconfigPaths(),
        istanbul({
            include: ['app/**/*'],
            exclude: ['node_modules/**/*', 'cypress/**/*', 'build/**/*'],
            extension: ['.js', '.ts', '.jsx', '.tsx'],
            cypress: true,
            requireEnv: false,
        }),
    ],
    server: {
        port: 3000,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
    },
    build: { sourcemap: coverageOn },
});
