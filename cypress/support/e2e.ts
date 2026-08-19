// ***********************************************************
// Cypress e2e support — loaded before test files.
// ***********************************************************

import './commands';

// Code coverage (optional): install @cypress/code-coverage and enable the task in cypress.config.ts
// import '@cypress/code-coverage/support';

// Do NOT start MSW's browser worker here.
// This file runs in the Cypress runner frame, not the AUT — setting window.__mswReady
// here does not affect cy.window() after cy.visit().
// Server loaders/actions are mocked by Node MSW in app/root.tsx (VITE_MOCK_CYPRESS=true).
