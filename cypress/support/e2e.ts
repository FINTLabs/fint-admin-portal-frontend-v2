// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Code coverage - always collected, view manually with: npm run coverage:report
import '@cypress/code-coverage/support';

// Start MSW in Cypress
import { worker } from '../mocks/browsers';

before(async () => {
    await worker.start({
        onUnhandledRequest: 'bypass',
    });
});

after(() => {
    worker.stop();
});

// Reset handlers between tests
beforeEach(() => {
    worker.resetHandlers();
});

// Define custom command directly here to ensure it loads
declare global {
    namespace Cypress {
        interface Chainable {
            waitForAppReady(): Chainable<void>;
        }
    }
}

// cypress/support/commands.ts
declare global {
    namespace Cypress {
      interface Chainable {
        waitForAppReady(): Chainable<void>;
      }
    }
  }
  
  Cypress.Commands.add('waitForAppReady', () => {
    // (A) Document loaded
    cy.document().its('readyState', { timeout: 20_000 }).should('eq', 'complete');
  
    // (B) Theme attribute applied
    cy.get('[data-theme="novari"]', { timeout: 20_000 }).should('exist');
  
    // (C) Aksel stylesheet link present
    cy.get('link[rel="stylesheet"][href*="@navikt/ds-css"]', { timeout: 20_000 }).should('exist');
  
    // (D) Aksel CSS actually parsed:
    // Check a known Aksel CSS variable exists on :root (non-empty value).
    // Example tokens: --a-font-size-large, --a-text-default, --a-border-default
    cy.window({ timeout: 20_000 }).then((win) => {
      const getVar = (name: string) =>
        win.getComputedStyle(win.document.documentElement).getPropertyValue(name).trim();
  
      // retry until at least one variable is non-empty
      cy.wrap(null, { timeout: 20_000 })
        .should(() => {
          const token = getVar('--a-font-size-large') || getVar('--a-text-default') || getVar('--a-border-default');
          expect(token, 'Aksel CSS variables should be populated').to.be.a('string').and.not.equal('');
        });
    });
  
    // (E) Fonts ready (layout settles after fonts load)
    cy.window({ timeout: 20_000 }).then((win) => win.document.fonts.ready);
  
    // (F) MSW ready (only if you’re using browser worker in tests)
    cy.window({ timeout: 20_000 })
      .its('__mswReady')
      .should('eq', true);
  });
  
