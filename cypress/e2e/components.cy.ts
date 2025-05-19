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

describe('Components Page Tests', () => {
    beforeEach(() => {
        // Visit the components page before each test
        cy.visit('http://localhost:3000/component');
        // Wait for the page to load
        cy.contains('Component 1', { timeout: 10000 }).should('be.visible');
    });

    it('should display components correctly', () => {
        // Check that the components table is displayed with expected data
        cy.contains('Component 1').should('be.visible');
        cy.contains('Component 2').should('be.visible');

        // Check that the table has the expected structure
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    // it('should expand details when clicked', () => {
    //     cy.get('[data-cy="component-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="component-row"]').first().find('button').first().trigger('click');
    //     cy.wait(100);
    //
    //     // Check that the expanded content shows the description
    //     cy.contains('Endepunkter').should('be.visible');
    //
    //     // Close the expanded row
    //     cy.get('[data-cy="component-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="component-row"]').first().find('button').first().trigger('click');
    //
    //     // Check that the description is no longer visible
    //     cy.contains('Endepunkter').should('not.be.visible');
    // });

    it('should have a actions menu', () => {
        // Click the actions button for Component 1
        cy.get('[data-cy="component-row"]').first().find('button').last().focus();
        cy.wait(100);
        cy.get('[data-cy="component-row"]').first().find('button').last().trigger('click');

        cy.get('[data-cy="component-action-menu"]').should('be.visible');
        cy.get('[data-cy="component-row"]').first().find('button').last().trigger('click');
    });

    it('should filter with search', () => {
        // Type in the search box
        cy.get('[data-cy="component-search-box"]').should('exist');
        cy.get('[data-cy="component-search-box"]').focus();
        cy.get('[data-cy="component-search-box"]').clear();
        cy.get('[data-cy="component-search-box"]').type('Component 1', { delay: 100 });

        // Check that only 1 row is visible
        cy.get('[data-cy="component-row"]').should('have.length', 1);

        // Clear the search
        cy.get('[data-cy="component-search-box"]').focus();
        cy.get('[data-cy="component-search-box"]').clear();
        cy.wait(1000);

        // Check that all are visible again
        cy.get('[data-cy="component-row"]').should('have.length.greaterThan', 1);
    });

    it('should add a new component', () => {
        // Click the add button
        cy.get('[data-cy="add-button"]').should('exist');
        cy.get('[data-cy="add-button"]').focus();
        cy.wait(100);
        cy.get('[data-cy="add-button"]').invoke('click');

        // Check that the form appears
        cy.contains('Legg til ny komponent').should('be.visible');

        // Fill out the form based on the IComponent interface
        cy.get('[data-cy="name-input"]').type('Component 3');
        cy.get('[data-cy="description-input"]').type('Test component 3');
        cy.get('[data-cy="basePath-input"]').type('/api/component3');

        // Toggle checkboxes for boolean fields
        cy.get('[data-cy="inBeta-checkbox"]').check();
        cy.get('[data-cy="common-checkbox"]').check();

        // Submit the form
        cy.get('[data-cy="submit-button"]').click();

        // Check for success alert
        cy.contains('Komponenten er lagt til').should('be.visible');
    });
});
