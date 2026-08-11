Cypress.on('uncaught:exception', (err) => {
    // Cypress and React Hydrating the document don't get along
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
        cy.visit('/');
        cy.waitForAppReady();
        cy.contains('.novari-header-title, h1', 'FINT Admin Portal', { timeout: 10000 }).should(
            'be.visible'
        );
    });

    it('should load the home page', () => {
        cy.contains('.novari-header-title, h1', 'FINT Admin Portal').should('be.visible');

        cy.get('.novari-header').should('be.visible');
        cy.get('.novari-footer, footer').should('exist');

        cy.get('a[href="/contact"]').should('be.visible').and('contain', 'Kontakter');
        cy.get('a[href="/component"]').should('be.visible').and('contain', 'Komponenter');
        cy.get('a[href="/organisation"]').should('be.visible').and('contain', 'Organisasjoner');
        cy.get('a[href="/tools"]').should('be.visible').and('contain', 'Tools');
    });

    it('should handle navigation between pages', () => {
        cy.get('a[href="/contact"]').click({ force: true });
        cy.url().should('include', '/contact');
        cy.contains('h1', 'Kontakter', { timeout: 10000 }).should('be.visible');

        cy.visit('/');
        cy.waitForAppReady();

        cy.get('a[href="/component"]').click({ force: true });
        cy.url().should('include', '/component');
        cy.contains('h1', 'Komponenter', { timeout: 10000 }).should('be.visible');

        cy.visit('/');
        cy.waitForAppReady();

        cy.get('a[href="/organisation"]').click({ force: true });
        cy.url().should('include', '/organisation');
        cy.contains('h1', 'Organisasjoner', { timeout: 10000 }).should('be.visible');

        cy.visit('/');
        cy.waitForAppReady();

        cy.get('a[href="/tools"]').click({ force: true });
        cy.url().should('include', '/tools');
    });

    it('should have a working menu', () => {
        cy.get('.novari-header').should('be.visible');
        cy.get('.novari-header-menu, .novari-header').should('exist');
        cy.contains('a, button', 'Kontakt').should('exist');
        cy.contains('a, button', 'Organisasjoner').should('exist');
        cy.contains('a, button', 'Komponenter').should('exist');
    });

    it('should have a working logout', () => {
        cy.get('.novari-header').should('be.visible');
        cy.get('.novari-header button[title="logg ut"], .novari-header button[title="Logg ut"]')
            .should('exist')
            .and('be.visible');
    });
});
