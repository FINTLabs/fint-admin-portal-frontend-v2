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

    // Wait until the client app has hydrated / MSW is ready so clicks work
    cy.window({ timeout: 20_000 }).its('__mswReady').should('eq', true);

    // Prefer known interactive controls; fall back to any main link/button
    const controlSelector = [
        '[data-cy="add-button"]',
        '[data-cy="contact-action-menu-button"]',
        '[data-cy="component-action-menu-button"]',
        '[data-cy="organisation-action-menu-button"]',
        'main a',
        'main button',
        '.novari-header button',
    ].join(', ');

    cy.get(controlSelector, { timeout: 20_000 })
        .first()
        .should(($el) => {
            const node = $el[0] as object;
            const hasReact = Object.getOwnPropertyNames(node).some((k) =>
                k.toLowerCase().includes('react')
            );
            expect(hasReact, 'element should be React-hydrated').to.eq(true);
        });
});

export {};
