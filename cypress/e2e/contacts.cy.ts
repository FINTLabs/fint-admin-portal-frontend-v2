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
        cy.waitForAppReady();
        
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
        cy.get('[data-cy="contact-action-menu-button"]').should('exist').and('be.visible');
    });

    it('should edit an existing contact', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        // Click edit button on first contact
        cy.get('[data-cy="contact-action-menu-button"]').first().click();
        
        // Click edit option from menu
        cy.get('[data-cy="contacts-action-menu"]', { timeout: 5000 }).should('be.visible');
        cy.get('[data-cy="contacts-action-menu"]').should('not.be.disabled');
        cy.get('[data-cy="contacts-action-menu"]').first().click();
        //cy.contains('Redigere kontakt').click();
        
        // Wait for table to disappear
        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        
        // Wait for form fields to appear (editing mode)
        cy.get('[data-cy="first-name-input"]', { timeout: 10000 }).should('be.visible');
        
        // Verify fields are populated with existing contact data (from the useEffect)
        cy.get('[data-cy="first-name-input"]').should('not.have.value', '');
        cy.get('[data-cy="last-name-input"]').should('not.have.value', '');
        cy.get('[data-cy="email-input"]').should('not.have.value', '');
        cy.get('[data-cy="mobile-input"]').should('not.have.value', '');
        
        // Verify submit button shows "Oppdater kontakt" (update mode)
        cy.get('[data-cy="submit-button"]').should('contain', 'Oppdater kontakt');
        
        // Edit the values
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('Updated');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Name');
        
        // Submit changes
        cy.get('[data-cy="submit-button"]')
            .should('be.visible')
            .click({ force: true });
        
        // Back at table
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should filter contacts with search', () => {
        // Get initial row count
        cy.get('[data-cy="contact-row"]').should('have.length.greaterThan', 0).then(($rows) => {
            const initialCount = $rows.length;
            
            // Wait for search box to be ready
            cy.get('input[data-cy="contact-search-box"]')
                .should('be.visible')
                .and('not.be.disabled');
            
            // Search for John
            cy.get('input[data-cy="contact-search-box"]').clear({ force: true });
            cy.get('input[data-cy="contact-search-box"]').type('John', { force: true });
            
            // Wait for filtering
            cy.get('[data-cy="contact-row"]', { timeout: 5000 })
                .should('have.length.lessThan', initialCount);
            
            // Clear the search
            cy.get('input[data-cy="contact-search-box"]').clear({ force: true });
            
            // All contacts visible again
            cy.get('[data-cy="contact-row"]', { timeout: 5000 })
                .should('have.length', initialCount);
        });
    });

    it('should add a new contact', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        cy.get('[data-cy="contact-row"]').should('exist');

        // Click the add button - wait for it to be stable
        cy.get('[data-cy="add-button"]')
            .should('be.visible')
            .and('not.be.disabled');
            cy.get('[data-cy="add-button"]').click();
        

        // Wait for table to disappear
        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        
        // Check that the form appears
        cy.contains('Legg til ny kontakt', { timeout: 10000 }).should('be.visible');

        // Wait for all form fields to be ready
        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible').and('not.be.disabled');
        cy.get('[data-cy="first-name-input"]').should('be.visible');
        cy.get('[data-cy="last-name-input"]').should('be.visible');
        cy.get('[data-cy="email-input"]').should('be.visible');
        cy.get('[data-cy="mobile-input"]').should('be.visible');
        
        // Fill out the form completely
        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').type('New');
        cy.get('[data-cy="last-name-input"]').type('Contact');
        cy.get('[data-cy="email-input"]').type('new.contact@example.com');
        cy.get('[data-cy="mobile-input"]').type('98765432');
        
        // Submit the form
        cy.get('[data-cy="submit-button"]')
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
        
        // Verify back at table
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should show validation errors on empty submit', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        // Open form
        cy.get('[data-cy="add-button"]')
            .should('be.visible')
            .and('not.be.disabled');
            cy.get('[data-cy="add-button"]').click();
        
        // Wait for table to disappear
        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        
        // Wait for form
        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        
        // Try to submit empty form (should trigger validation)
        cy.get('[data-cy="submit-button"]').click();
        
        // Validation errors should appear
        cy.contains('Fødselsnummer er påkrevd', { timeout: 5000 }).should('be.visible');
        cy.contains('Fornavn er påkrevd').should('be.visible');
        cy.contains('Etternavn er påkrevd').should('be.visible');
        cy.contains('E-post informasjon er påkrevd').should('be.visible');
        cy.contains('Mobile informasjon er påkrevd').should('be.visible');
    });

    it('should validate and cancel contact form', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        // Open form
        cy.get('[data-cy="add-button"]')
            .should('be.visible')
            .and('not.be.disabled');
            cy.get('[data-cy="add-button"]').click();
        
        // Wait for table to disappear
        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        
        cy.contains('Legg til ny kontakt', { timeout: 10000 }).should('be.visible');
        
        // Fill partial form to test cancel with data
        cy.get('[data-cy="first-name-input"]').type('Test');
        cy.get('[data-cy="last-name-input"]').type('User');
        cy.get('[data-cy="email-input"]').type('test@example.com');
        
        // Click cancel
        cy.get('[data-cy="cancel-button"]')
            .should('be.visible')
            .and('not.be.disabled');
        
        cy.get('[data-cy="cancel-button"]').click({ force: true });
        
        // Should be back at table
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should test all form field changes', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        // Open form
        cy.get('[data-cy="add-button"]')
            .should('be.visible');
            cy.get('[data-cy="add-button"]').click();
        
        // Wait for form
        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        
        // Type in each field to trigger onChange handlers
        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('111');
        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('11111111111');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('A');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('Alice');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('B');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Brown');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('a');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('alice@test.com');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('1');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('12345678');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('A');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('Alice');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('B');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Brown');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('a');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('alice@test.com');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('1');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('12345678');
        
        // Verify values are set
        cy.get('[data-cy="nin-input"]').should('have.value', '11111111111');
        cy.get('[data-cy="first-name-input"]').should('have.value', 'Alice');
        cy.get('[data-cy="last-name-input"]').should('have.value', 'Brown');
        cy.get('[data-cy="email-input"]').should('have.value', 'alice@test.com');
        cy.get('[data-cy="mobile-input"]').should('have.value', '12345678');
        
        // Cancel
        cy.get('[data-cy="cancel-button"]').click();
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should test partial validation', () => {
        cy.visit('http://localhost:3000/contact');
        cy.waitForAppReady();
        
        // Open form
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });
        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        
        // Fill only some fields
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').type('Test');
        // Leave lastName, email, mobile empty
        
        // Submit - should show errors for missing fields
        cy.get('[data-cy="submit-button"]').click();
        
        // Check specific missing field errors
        cy.contains('Etternavn er påkrevd').should('be.visible');
        cy.contains('E-post informasjon er påkrevd').should('be.visible');
        cy.contains('Mobile informasjon er påkrevd').should('be.visible');
        
        // Fill remaining fields
        cy.get('[data-cy="last-name-input"]').type('User');
        cy.get('[data-cy="email-input"]').type('test@example.com');
        cy.get('[data-cy="mobile-input"]').type('98765432');
        
        // Submit should work now
        cy.get('[data-cy="submit-button"]').click();
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });
});
