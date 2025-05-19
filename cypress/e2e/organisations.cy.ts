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

describe('Organisations Page Tests', () => {
    beforeEach(() => {
        // Visit the organisations page before each test
        cy.visit('http://localhost:3000/organisation');
        // Wait for the page to load
        cy.contains('Test Organisation 1', { timeout: 10000 }).should('be.visible');
    });

    it('should display organisations correctly', () => {
        // Check that the organisations table is displayed with expected data
        cy.contains('Test Organisation 1').should('be.visible');
        cy.contains('Test Organisation 2').should('be.visible');

        // Check that the table has the expected structure
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    // it('should expand details when clicked', () => {
    //     cy.get('[data-cy="organisation-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="organisation-row"]').first().find('button').first().trigger('click');
    //     cy.wait(100);
    //
    //     // Check that the expanded content shows the email
    //     cy.contains('Juridisk kontakter').should('be.visible');
    //
    //     // // Close the expanded row
    //     cy.get('[data-cy="organisation-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="organisation-row"]').first().find('button').first().trigger('click');
    //     cy.wait(100);
    //
    //     // Check that the email is no longer visible
    //     cy.contains('Juridisk kontakter').should('not.be.visible');
    // });

    it('should have a actions menu', () => {
        cy.get('[data-cy="organisation-action-menu-button"]').should('exist');
        cy.wait(100);
    });

    it('should filter with search', () => {
        // Type in the search box
        cy.get('[data-cy="organisation-search-box"]').should('exist');
        cy.get('[data-cy="organisation-search-box"]').focus();
        cy.get('[data-cy="organisation-search-box"]').clear();
        cy.get('[data-cy="organisation-search-box"]').type('Test Organisation 10', { delay: 100 });

        // Check that only 1 row is visible
        cy.get('[data-cy="organisation-row"]').should('have.length', 1);

        // Clear the search
        cy.get('[data-cy="organisation-search-box"]').focus();
        cy.get('[data-cy="organisation-search-box"]').clear();
        cy.wait(1000);

        // Check that all are visible again
        cy.get('[data-cy="organisation-row"]').should('have.length.greaterThan', 1);
    });

    it('should handle pagination ', () => {
        // Click on page 2
        cy.get('[data-cy="org-pagination"]').should('exist');
        cy.get('[data-cy="org-pagination"]').last().click();
        cy.get(':nth-child(3) > .navds-pagination__item').click();
        cy.contains('Test Organisation 5').should('be.visible');
    });

    it('should add a new organisation', () => {
        // Click the add button
        cy.get('[data-cy="add-button"]').should('exist');
        cy.get('[data-cy="add-button"]').focus();
        cy.wait(100);
        cy.get('[data-cy="add-button"]').invoke('click');

        // Check that the form appears
        cy.contains('Legg til ny organisasjon').should('be.visible');

        // Fill out the form
        cy.get('[data-cy="name-input"]').type('Test Organisation 3');
        cy.get('[data-cy="org-number-input"]').type('987654321');
        cy.get('[data-cy="display-name-input"]').type('test_org_3');

        // Submit the form
        cy.get('[data-cy="submit-button"]').click();

        // Check for success alert
        cy.contains('Organisasjonen er lagt til').should('be.visible');

        // Verify the new organisation appears in the list
        cy.contains('Test Organisation 3').should('be.visible');
    });
});
