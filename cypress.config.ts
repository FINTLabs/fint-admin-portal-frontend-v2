import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        env: {
            VITE_MOCK_CYPRESS: 'true',
        },
        viewportWidth: 1920,
        viewportHeight: 1580,
    },
});
