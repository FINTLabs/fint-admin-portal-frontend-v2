Cypress.on('uncaught:exception', (err) => {
    // Cypress and React Hydrating the document don't get along
    // for some unknown reason. Hopefully, we figure out why eventually
    // so we can remove this.
    // https://github.com/remix-run/remix/issues/4822#issuecomment-1679195650
    // https://github.com/cypress-io/cypress/issues/27204
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe('Page Load Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.reload();
        cy.contains('h1', 'FINT Admin Portal', { timeout: 10000 }).should('be.visible');
    });

    it('should load the home page', () => {
        cy.contains('h1', 'FINT Admin Portal', { timeout: 10000 }).should('be.visible');

        // Check for other key elements on the home page
        cy.get('nav').should('be.visible');
        cy.get('footer').should('exist');

        cy.get('[data-cy="Kontakter-link-panel"]').should('be.visible');
        cy.get('[data-cy="Komponenter-link-panel"]').should('be.visible');
        cy.get('[data-cy="Organisasjoner-link-panel"]').should('be.visible');
        cy.get('[data-cy="Tools-link-panel"]').should('be.visible');
    });

    it('should handle navigation between pages', () => {
        // cy.get('.navds-button').first().click({ force: true });

        // Navigate to organisation page using the navigation menu
        cy.get('[data-cy="Kontakter-link-panel"]').click();
        cy.url().should('include', '/contact');

        cy.visit('http://localhost:3000');

        // Navigate to component page
        cy.get('[data-cy="Komponenter-link-panel"]').click();
        cy.url().should('include', '/component');
        cy.visit('http://localhost:3000');

        // Navigate to contact page
        cy.get('[data-cy="Organisasjoner-link-panel"]').click();
        cy.url().should('include', '/organisation');
        cy.visit('http://localhost:3000');

        // Navigate to tools page
        cy.get('[data-cy="Tools-link-panel"]').click();
        cy.url().should('include', '/tools');
        cy.visit('http://localhost:3000');
        cy.reload();
    });

    it('should have a working menu', () => {
        // test menu
    });

    it('should have a working logout', () => {
        // test logout
    });
});
