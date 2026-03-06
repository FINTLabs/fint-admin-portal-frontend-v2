import { defineConfig } from 'cypress';
// import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // register the task to save coverage to .nyc_output
            // codeCoverageTask(on, config);

            // do NOT call any "coverageReport" or open-report logic here
            return config;
        },
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        defaultCommandTimeout: 10_000,
        pageLoadTimeout: 60_000,
    },

    // optional: only needed if you also collect backend coverage at /__coverage__
    // env: { codeCoverage: { url: 'http://localhost:3000/__coverage__' } },
});
