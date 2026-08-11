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

describe('Organisations Page Tests', () => {
    beforeEach(() => {
        cy.visit('/organisation');
        cy.waitForAppReady();
        cy.contains('h1', 'Organisasjoner', { timeout: 10000 }).should('be.visible');
        cy.contains('Test Organisation 1', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="organisation-row"]', { timeout: 10000 }).should('exist');
    });

    it('should display organisations correctly', () => {
        cy.contains('Test Organisation 1').should('be.visible');
        cy.contains('Test Organisation 2').should('be.visible');
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    it('should have a actions menu', () => {
        cy.get('[data-cy="organisation-action-menu-button"]').should('exist').and('be.visible');
    });

    it('should filter with search', () => {
        cy.get('[data-cy="organisation-row"]')
            .should('have.length.greaterThan', 1)
            .then(($rows) => {
                const initialCount = $rows.length;

                cy.get('input[data-cy="organisation-search-box"]').should('be.visible');
                cy.get('input[data-cy="organisation-search-box"]').should('not.be.disabled');
                cy.get('input[data-cy="organisation-search-box"]').clear({ force: true });
                cy.get('input[data-cy="organisation-search-box"]').type('Test Organisation 10', {
                    force: true,
                });

                cy.get('[data-cy="organisation-row"]', { timeout: 5000 }).should('have.length', 1);
                cy.get('[data-cy="organisation-row"]').should('contain', 'Test Organisation 10');

                cy.get('input[data-cy="organisation-search-box"]').clear({ force: true });
                cy.get('[data-cy="organisation-row"]', { timeout: 5000 }).should(
                    'have.length',
                    initialCount
                );
            });
    });

    it('should handle pagination', () => {
        // 20 fixtures, 15 per page (localeCompare sort) → page 2 shows orgs 5–9
        cy.get('[data-cy="org-pagination"]').should('exist');
        cy.get('[data-cy="organisation-row"]').should('have.length', 15);

        cy.get('[data-cy="org-pagination"]').within(() => {
            cy.contains('button, a', '2').click({ force: true });
        });

        cy.get('[data-cy="organisation-row"]', { timeout: 5000 }).should('have.length', 5);
        cy.contains('Test Organisation 5').should('be.visible');
        cy.contains('Test Organisation 9').should('be.visible');
    });

    it('should add a new organisation', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="organisation-row"]', { timeout: 5000 }).should('not.exist');
        cy.contains('h1', 'Legg til ny organisasjon', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="name-input"]').clear();
        cy.get('[data-cy="name-input"]').type('Test Organisation New');
        cy.get('[data-cy="org-number-input"]').clear();
        cy.get('[data-cy="org-number-input"]').type('987654321');
        cy.get('[data-cy="display-name-input"]').clear();
        cy.get('[data-cy="display-name-input"]').type('test_org_new');

        cy.get('[data-cy="submit-button"]').should('be.visible');
        cy.get('[data-cy="submit-button"]').should('not.be.disabled');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.get('[data-cy="organisation-row"]', { timeout: 10000 }).should('exist');
    });

    it('should validate and cancel organisation form', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="organisation-row"]', { timeout: 5000 }).should('not.exist');
        cy.contains('h1', 'Legg til ny organisasjon', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="name-input"]').type('Test Org');
        cy.get('[data-cy="org-number-input"]').type('123456789');

        cy.get('[data-cy="cancel-button"]').should('be.visible');
        cy.get('[data-cy="cancel-button"]').should('not.be.disabled');
        cy.get('[data-cy="cancel-button"]').click({ force: true });

        cy.get('[data-cy="organisation-row"]', { timeout: 10000 }).should('exist');
    });
});
