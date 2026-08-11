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

function openFirstComponentActionMenu() {
    cy.get('[data-cy="component-action-menu-button"]').first().scrollIntoView();
    cy.get('[data-cy="component-action-menu-button"]').first().should('be.visible');
    cy.get('[data-cy="component-action-menu-button"]').first().click({ force: true });

    cy.get('[data-cy="component-action-menu-button"]')
        .first()
        .should('have.attr', 'aria-expanded', 'true');
}

describe('Component delete flow - cancel', () => {
    it('opens delete dialog and cancels without deleting', () => {
        cy.visit('/component');
        cy.waitForAppReady();
        cy.url().should('include', '/component');
        cy.contains('h1', 'Komponenter', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');

        cy.get('[data-cy="component-row"]').its('length').as('initialCount');

        openFirstComponentActionMenu();

        cy.contains('[role="menuitem"]', 'Slett komponent').click({ force: true });

        cy.get('[data-cy="confirmation-cancel-button"]:visible').first().click({ force: true });

        cy.get('[data-cy="confirmation-modal"]:visible').should('not.exist');

        cy.get('@initialCount').then((initialCount) => {
            cy.get('[data-cy="component-row"]').should('have.length', initialCount);
        });
    });
});

describe('Component delete flow - confirm with basepath', () => {
    it('opens delete dialog, types basepath, and confirms deletion', () => {
        cy.visit('/component');
        cy.waitForAppReady();
        cy.url().should('include', '/component');
        cy.contains('h1', 'Komponenter', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');

        openFirstComponentActionMenu();

        cy.contains('[role="menuitem"]', 'Slett komponent').click({ force: true });

        cy.get('[data-cy="confirmation-modal"]', { timeout: 10000 }).should('exist');
        cy.get('[data-cy="confirmation-input"]:visible').first().clear({ force: true });
        cy.get('[data-cy="confirmation-input"]:visible')
            .first()
            .type('/api/component1', { force: true });
        cy.get('[data-cy="confirmation-input"]:visible')
            .first()
            .should('have.value', '/api/component1');

        cy.get('[data-cy="confirmation-confirm-button"]:visible').first().should('not.be.disabled');
        cy.get('[data-cy="confirmation-confirm-button"]:visible').first().click({ force: true });

        cy.get('[data-cy="confirmation-modal"]:visible').should('not.exist');
    });
});

describe('Components Page Tests', () => {
    beforeEach(() => {
        cy.visit('/component');
        cy.waitForAppReady();
        cy.contains('h1', 'Komponenter', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');
        cy.get('[data-cy="add-button"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('input[data-cy="component-search-box"]', { timeout: 10000 }).should('be.visible');
        cy.get('input[data-cy="component-search-box"]').should('not.be.disabled');
    });

    it('should display components correctly', () => {
        cy.contains('Component 1').should('be.visible');
        cy.contains('Component 2').should('be.visible');
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    it('opens the action menu for the first component row', () => {
        openFirstComponentActionMenu();
        cy.contains('[role="menuitem"]', 'Redigere komponent').should('exist');
        cy.get('[data-cy="component-action-menu"]').should('exist');
    });

    it('should filter with search', () => {
        cy.get('[data-cy="component-row"]')
            .should('have.length.greaterThan', 1)
            .then(($rows) => {
                const initialCount = $rows.length;

                cy.get('input[data-cy="component-search-box"]').should('be.visible');
                cy.get('input[data-cy="component-search-box"]').should('not.be.disabled');
                cy.get('input[data-cy="component-search-box"]').clear({ force: true });
                cy.get('input[data-cy="component-search-box"]').type('Component 1', {
                    force: true,
                });

                cy.get('[data-cy="component-row"]', { timeout: 5000 }).should(
                    'have.length.lessThan',
                    initialCount
                );
                cy.get('[data-cy="component-row"]').should('have.length', 1);

                cy.get('[data-cy="component-row"]').first().should('contain', 'Component 1');

                cy.get('input[data-cy="component-search-box"]').clear({ force: true });
                cy.get('[data-cy="component-row"]', { timeout: 5000 }).should(
                    'have.length',
                    initialCount
                );
            });
    });

    it('should add a new component', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="component-row"]', { timeout: 5000 }).should('not.exist');
        cy.get('[data-cy="name-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="name-input"]').should('not.be.disabled');
        cy.get('[data-cy="description-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="basePath-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="inBeta-checkbox"]', { timeout: 10000 }).should('exist');
        cy.get('[data-cy="common-checkbox"]', { timeout: 10000 }).should('exist');

        cy.get('[data-cy="name-input"]').clear();
        cy.get('[data-cy="name-input"]').type('Component 3');
        cy.get('[data-cy="description-input"]').clear();
        cy.get('[data-cy="description-input"]').type('Test component 3');
        cy.get('[data-cy="basePath-input"]').clear();
        cy.get('[data-cy="basePath-input"]').type('/api/component3');
        cy.get('[data-cy="inBeta-checkbox"]').check({ force: true });
        cy.get('[data-cy="common-checkbox"]').check({ force: true });

        cy.get('[data-cy="submit-button"]').should('be.visible');
        cy.get('[data-cy="submit-button"]').should('not.be.disabled');
        cy.get('[data-cy="submit-button"]').click({ force: true });

        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');
    });

    it('should validate component form', () => {
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').should('not.be.disabled');
        cy.get('[data-cy="add-button"]').click({ force: true });

        cy.get('[data-cy="component-row"]', { timeout: 5000 }).should('not.exist');
        cy.get('[data-cy="name-input"]', { timeout: 10000 }).should('be.visible');

        cy.get('[data-cy="name-input"]').clear();
        cy.get('[data-cy="description-input"]').clear();
        cy.get('[data-cy="basePath-input"]').clear();
        cy.get('[data-cy="submit-button"]').click({ force: true });

        // Stay on the form when required fields are empty
        cy.get('[data-cy="name-input"]').should('be.visible');
        cy.get('[data-cy="component-row"]').should('not.exist');
    });
});
