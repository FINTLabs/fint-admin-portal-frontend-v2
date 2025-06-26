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

describe('Contacts Page Tests', () => {
    beforeEach(() => {
        // Visit the contacts page before each test
        cy.visit('http://localhost:3000/contact');
        // Wait for the page to load
        cy.contains('td', 'John', { timeout: 10000 }).should('be.visible');
    });

    it('should display contacts correctly', () => {
        // Check that the contacts table is displayed with expected data
        cy.contains('td', 'John').should('be.visible');
        cy.contains('td', 'Doe').should('be.visible');
        cy.contains('td', 'Jane').should('be.visible');
        cy.contains('td', 'Smith').should('be.visible');

        // Check that the table has the expected structure
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    // it('should expand contact details when clicked', () => {
    //     cy.get('[data-cy="contact-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="contact-row"]').first().find('button').first().trigger('click');
    //
    //     // Check that the expanded content shows the email
    //     cy.contains('jane.smith@example.com').should('be.visible');
    //
    //     // // Close the expanded row
    //     cy.get('[data-cy="contact-row"]').first().find('button').first().focus();
    //     cy.wait(100);
    //     cy.get('[data-cy="contact-row"]').first().find('button').first().trigger('click');
    //
    //     // Check that the email is no longer visible
    //     cy.contains('jane.smith@example.com').should('not.be.visible');
    // });

    it('should have an action menu', () => {
        cy.get('[data-cy="contact-action-menu-button"]').should('exist');
    });

    it.skip('should filter contacts with search', () => {
        // Type in the search box
        cy.get('[data-cy="contact-search-box"]').should('exist');
        cy.get('[data-cy="contact-search-box"]').focus();
        cy.get('[data-cy="contact-search-box"]').clear();
        cy.get('[data-cy="contact-search-box"]').type('John', { delay: 100 });

        // Check that only John Doe is visible
        cy.wait(1000);
        cy.get('[data-cy="contact-row"]').should('have.length', 1);

        // Clear the search
        cy.get('[data-cy="contact-search-box"]').focus();
        cy.get('[data-cy="contact-search-box"]').clear();
        cy.wait(1000);

        // Check that all contacts are visible again
        cy.get('[data-cy="contact-row"]').should('have.length', 2);
    });

    it('should add a new contact', () => {
        // Click the add button (assuming the action button in the header)
        cy.get('[data-cy="add-button"]').should('exist');
        cy.get('[data-cy="add-button"]').focus();
        cy.wait(100);
        cy.get('[data-cy="add-button"]').invoke('click');
        cy.wait(1000);

        // Check that the form appears
        cy.contains('Legg til ny kontakt').should('be.visible');

        // Fill out the form
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').type('User');
        cy.get('[data-cy="last-name-input"]').type('Test');
        cy.get('[data-cy="email-input"]').type('test.user@example.com');
        cy.get('[data-cy="mobile-input"]').type('98765432');

        // Submit the form
        cy.get('[data-cy="submit-button"]').click();

        // Check for success alert
        cy.contains('Kontakten ble lagt til').should('be.visible');
        cy.wait(1000);
    });
});
