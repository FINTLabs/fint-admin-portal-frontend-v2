/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            waitForAppReady(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('waitForAppReady', () => {
    cy.document().its('readyState', { timeout: 20_000 }).should('eq', 'complete');
    cy.get('[data-theme="novari"]', { timeout: 20_000 }).should('exist');
    cy.get('main', { timeout: 20_000 }).should('be.visible');

    // Set in Layout after client hydration (useEffect). Survives Vite's first-load
    // "optimized dependencies changed" reload because Cypress retries until it exists.
    cy.get('html[data-app-ready="true"]', { timeout: 20_000 }).should('exist');
});

export {};
