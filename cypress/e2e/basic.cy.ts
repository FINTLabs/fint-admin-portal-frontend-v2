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
    it('should load the home page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('h1', 'FINT Admin Portal', { timeout: 10000 }).should('be.visible');

        // Check for other key elements on the home page
        cy.get('nav').should('be.visible');
        cy.get('footer').should('exist');
    });

    it('should load the organisation page', () => {
        cy.visit('http://localhost:3000/organisation');

        // Check for organisation-specific elements
        cy.contains('Test Organisation 1', { timeout: 10000 }).should('be.visible');
        cy.contains('Test Organisation 2').should('be.visible');

        // Check for table structure
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 2);
    });

    it('should load the component page', () => {
        cy.visit('http://localhost:3000/component');

        // Check for component-specific elements
        cy.contains('Component 1', { timeout: 10000 }).should('be.visible');
        cy.contains('Component 2').should('be.visible');

        // Check for component details
        cy.contains('Test component 1').should('be.visible');
    });

    it('should load the contact page', () => {
        cy.visit('http://localhost:3000/contact');

        // Check for contact-specific elements with first and last names in separate cells
        cy.contains('td', 'John', { timeout: 10000 }).should('be.visible');
        cy.contains('td', 'Doe').should('be.visible');

        // Click on the expandable row to open it
        cy.contains('td', 'John').parent('tr').find('button').first().click();

        // Close the expanded row
        cy.contains('td', 'John').parent('tr').find('button').first().click();

        // Check other contacts are visible
        cy.contains('td', 'Jane').should('be.visible');
        cy.contains('td', 'Smith').should('be.visible');
    });

    it('should load the tools page', () => {
        cy.visit('http://localhost:3000/tools');

        // Check for tools-specific elements
        cy.contains('Organizations', { timeout: 10000 }).should('be.visible');
        cy.contains('Adapter').should('be.visible');
        cy.contains('Client').should('be.visible');

        // Check for report buttons
        cy.get('button').should('have.length.at.least', 3);
    });

    it('should handle navigation between pages', () => {
        // Start at home page
        cy.visit('http://localhost:3000');

        cy.get('.navds-button').first().click({ force: true });

        // Navigate to organisation page using the navigation menu
        cy.get('button').contains('Organisasjoner').click();
        cy.url().should('include', '/organisation');
        cy.contains('Test Organisation 1', { timeout: 10000 }).should('be.visible');

        // Navigate to component page
        cy.get('button').contains('Komponenter').click({ force: true });
        cy.url().should('include', '/component');
        cy.contains('Component 1', { timeout: 10000 }).should('be.visible');

        // Navigate to contact page
        cy.get('button').contains('Kontakter').click({ force: true });
        cy.url().should('include', '/contact');
        cy.contains('td', 'John', { timeout: 10000 }).should('be.visible');

        // Navigate to tools page
        cy.get('button').contains('Tools').click({ force: true });
        cy.url().should('include', '/tools');
        cy.contains('Organizations', { timeout: 10000 }).should('be.visible');
    });
});
