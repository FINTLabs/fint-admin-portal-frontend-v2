/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            waitForAppReady(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('waitForAppReady', () => {
    cy.reload();

    // Wait for Novari theme to be applied
    cy.get('[data-theme="novari"]', { timeout: 10000 }).should('exist');
    
    // Wait for page structure to be ready
    cy.get('main', { timeout: 10000 }).should('be.visible');
    
    // Wait for document to be fully loaded
    cy.document().its('readyState').should('eq', 'complete');
});

// Make this file a module
export {};