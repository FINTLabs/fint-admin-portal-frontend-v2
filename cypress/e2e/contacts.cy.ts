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

describe('Contacts Page Tests', () => {
    beforeEach(() => {
        cy.visit('/contact');
        cy.waitForAppReady();
        cy.contains('td', 'John', { timeout: 10000 }).should('be.visible');
    });

    it('should display contacts correctly', () => {
        cy.contains('td', 'John').should('be.visible');
        cy.contains('td', 'Doe').should('be.visible');
        cy.contains('td', 'Jane').should('be.visible');
        cy.contains('td', 'Smith').should('be.visible');
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    it('should have an action menu', () => {
        cy.get('[data-cy="contact-action-menu-button"]').should('exist').and('be.visible');
    });

    it('should edit an existing contact', () => {
        cy.get('[data-cy="contact-action-menu-button"]').first().scrollIntoView();
        cy.get('[data-cy="contact-action-menu-button"]').first().should('be.visible');
        cy.get('[data-cy="contact-action-menu-button"]').first().click({ force: true });

        cy.get('[data-cy="contact-action-menu-button"]')
            .first()
            .should('have.attr', 'aria-expanded', 'true');

        cy.contains('[role="menuitem"]', 'Redigere kontakt').click({ force: true });

        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        cy.get('[data-cy="first-name-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="first-name-input"]').should('not.have.value', '');
        cy.get('[data-cy="last-name-input"]').should('not.have.value', '');
        cy.get('[data-cy="email-input"]').should('not.have.value', '');
        cy.get('[data-cy="mobile-input"]').should('not.have.value', '');
        cy.get('[data-cy="submit-button"]').should('contain', 'Oppdater kontakt');

        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('Updated');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Name');
        cy.get('[data-cy="submit-button"]').should('be.visible');
        cy.get('[data-cy="submit-button"]').click({ force: true });
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should filter contacts with search', () => {
        cy.get('[data-cy="contact-row"]')
            .should('have.length.greaterThan', 0)
            .then(($rows) => {
                const initialCount = $rows.length;

                cy.get('input[data-cy="contact-search-box"]').should('be.visible');
                cy.get('input[data-cy="contact-search-box"]').should('not.be.disabled');
                cy.get('input[data-cy="contact-search-box"]').clear({ force: true });
                cy.get('input[data-cy="contact-search-box"]').type('John', { force: true });

                cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should(
                    'have.length.lessThan',
                    initialCount
                );

                cy.get('input[data-cy="contact-search-box"]').clear({ force: true });
                cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should(
                    'have.length',
                    initialCount
                );
            });
    });

    it('should show toaster when a contact is added', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.contains('h1', 'Legg til ny kontakt', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('New');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Contact');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('new.contact@example.com');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('98765432');

        cy.get('[data-cy="submit-button"]').should('be.visible');
        cy.get('[data-cy="submit-button"]').should('not.be.disabled');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.get('[role="status"]', { timeout: 10000 }).should('be.visible');
        cy.get('[role="status"]').should('contain.text', 'Kontakten ble lagt til');
    });

    it('should add a new contact', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="contact-row"]', { timeout: 5000 }).should('not.exist');
        cy.contains('h1', 'Legg til ny kontakt', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="nin-input"]').should('not.be.disabled');
        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('New');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Contact');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('new.contact@example.com');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('98765432');

        cy.get('[data-cy="submit-button"]').should('be.visible');
        cy.get('[data-cy="submit-button"]').should('not.be.disabled');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should show validation errors on empty submit', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.contains('Fødselsnummer er påkrevd', { timeout: 5000 }).should('be.visible');
        cy.contains('Fornavn er påkrevd').should('be.visible');
        cy.contains('Etternavn er påkrevd').should('be.visible');
        cy.contains('E-post informasjon er påkrevd').should('be.visible');
        cy.contains('Mobile informasjon er påkrevd').should('be.visible');
    });

    it('should validate and cancel contact form', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.contains('h1', 'Legg til ny kontakt', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="first-name-input"]').type('Test');
        cy.get('[data-cy="last-name-input"]').type('User');
        cy.get('[data-cy="email-input"]').type('test@example.com');

        cy.get('[data-cy="cancel-button"]').should('be.visible');
        cy.get('[data-cy="cancel-button"]').should('not.be.disabled');
        cy.get('[data-cy="cancel-button"]').click({ force: true });

        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should test all form field changes', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').click({ force: true });
        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="nin-input"]').clear();
        cy.get('[data-cy="nin-input"]').type('11111111111');
        cy.get('[data-cy="first-name-input"]').clear();
        cy.get('[data-cy="first-name-input"]').type('Alice');
        cy.get('[data-cy="last-name-input"]').clear();
        cy.get('[data-cy="last-name-input"]').type('Brown');
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('alice@test.com');
        cy.get('[data-cy="mobile-input"]').clear();
        cy.get('[data-cy="mobile-input"]').type('12345678');

        cy.get('[data-cy="nin-input"]').should('have.value', '11111111111');
        cy.get('[data-cy="first-name-input"]').should('have.value', 'Alice');
        cy.get('[data-cy="last-name-input"]').should('have.value', 'Brown');
        cy.get('[data-cy="email-input"]').should('have.value', 'alice@test.com');
        cy.get('[data-cy="mobile-input"]').should('have.value', '12345678');

        cy.get('[data-cy="cancel-button"]').click({ force: true });
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });

    it('should test partial validation', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="nin-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="nin-input"]').type('12345678901');
        cy.get('[data-cy="first-name-input"]').type('Test');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.contains('Etternavn er påkrevd').should('be.visible');
        cy.contains('E-post informasjon er påkrevd').should('be.visible');
        cy.contains('Mobile informasjon er påkrevd').should('be.visible');

        cy.get('[data-cy="last-name-input"]').type('User');
        cy.get('[data-cy="email-input"]').type('test@example.com');
        cy.get('[data-cy="mobile-input"]').type('98765432');
        cy.get('[data-cy="submit-button"]').click({ force: true });
        cy.get('[data-cy="contact-row"]', { timeout: 10000 }).should('exist');
    });
});
