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

// cypress/e2e/component.delete-cancel.cy.ts
describe('Component delete flow - cancel', () => {
    it('opens delete dialog and cancels without deleting', () => {
        // Navigate to Components page
        cy.visit('http://localhost:3000/component');
        cy.waitForAppReady();
        cy.url().should('include', '/component');
        cy.title().should('eq', 'Novari admin-portal');

        // Capture initial row count to ensure no deletion
        cy.get("[data-cy='component-row']").its('length').as('initialCount');

        // Open action menu for first component
        cy.get("[data-cy='component-row']")
            .first()
            .within(() => {
                cy.get("[data-cy='component-action-menu-button']").click({ force: true });
            });

        // Click "Slett komponent" (Delete component) in action menu
        cy.contains('[role="menuitem"], .navds-action-menu__item', 'Slett komponent')
            .should('be.visible')
            .click({ force: true });

        // Ensure confirmation dialog appears
        cy.get('dialog,[role="dialog"]').should('be.visible');

        // Click "Avbryt" (Cancel)
        cy.contains('button', /^Avbryt$/).click({ force: true });

        // Confirm dialog closed
        cy.get('dialog,[role="dialog"]').should('not.be.visible');
    });
});

// cypress/e2e/component.delete-confirm.cy.ts
describe('Component delete flow - confirm with basepath', () => {
    it('opens delete dialog, types basepath, and confirms deletion', () => {
        // Match recorded viewport
        cy.viewport(1355, 1047);

        // Go to the components page and wait for Aksel/MSW/theme readiness
        cy.visit('http://localhost:3000/component');
        cy.waitForAppReady();

        cy.url().should('include', '/component');
        cy.title().should('eq', 'Novari admin-portal');

        // Capture initial count
        cy.get("[data-cy='component-row']").then(($rows) => {
            const initialCount = $rows.length;
            console.log('Initial count:', initialCount);

            // Open action menu for first row
            cy.get("[data-cy='component-row']")
                .first()
                .within(() => {
                    cy.get("[data-cy='component-action-menu-button']").click({ force: true });
                });

            // Choose "Slett komponent" from the menu
            cy.contains('[role="menuitem"], .navds-action-menu__item', 'Slett komponent')
                .should('be.visible')
                .click({ force: true });

            // Confirm dialog appears
            cy.get('dialog,[role="dialog"]').should('be.visible');
            cy.contains(/Bekreft sletting/i).should('exist');

            cy.get('[data-cy="confirmation-input"]').should('be.visible');
            cy.get('[data-cy="confirmation-input"]').clear();
            cy.get('[data-cy="confirmation-input"]').type('/api/component1');

            // Click the danger "Slett" confirm button
            cy.contains('button', /^Bekreft$/).click({ force: true });

            // Dialog should close
            cy.get('dialog,[role="dialog"]').should('not.be.visible');
        });
    });
});

describe('Components Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/component');
        cy.waitForAppReady();

        // Wait for page content to be fully loaded
        cy.contains('h1', 'Komponenter', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');

        // Wait for interactive elements to be ready
        cy.get('[data-cy="add-button"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');

        // Wait for search box to be enabled
        cy.get('[data-cy="component-search-box"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');
    });

    it('should display components correctly', () => {
        // Check that the components table is displayed with expected data
        cy.contains('Component 1').should('be.visible');
        cy.contains('Component 2').should('be.visible');

        // Check that the table has the expected structure
        cy.get('table').should('exist');
        cy.get('th').should('have.length.at.least', 3);
    });

    it('opens the action menu for the first component row', () => {
        // Match the recording’s viewport
        cy.viewport(1584, 1047);

        // Navigate to the page
        cy.visit('http://localhost:3000/component');

        // Assert we landed correctly
        cy.url().should('include', '/component');
        cy.title().should('eq', 'Novari admin-portal');

        // Click the action menu button on the first component row
        // Prefer stable data-cy selectors over deep CSS/xpath
        cy.get("[data-cy='component-row']")
            .first()
            .within(() => {
                cy.get("[data-cy='component-action-menu-button']").click();
            });

        // (Optional) Assert the menu becomes visible
        // Adjust selector if your menu has a better data-cy
        cy.get("[data-cy='component-action-menu']").should('be.visible');
    });

    it('should filter with search', () => {
        // First verify we start with multiple rows
        cy.get('[data-cy="component-row"]')
            .should('have.length.greaterThan', 1)
            .then(($rows) => {
                const initialCount = $rows.length;

                // Get the search input field directly and wait for it to be interactive
                cy.get('input[data-cy="component-search-box"]')
                    .should('be.visible')
                    .should('not.be.disabled')
                    .should('not.have.attr', 'disabled');

                // Now interact with the input - split into separate commands
                cy.get('input[data-cy="component-search-box"]').focus();
                cy.get('input[data-cy="component-search-box"]').clear({ force: true });
                cy.get('input[data-cy="component-search-box"]').type('Component 1', {
                    force: true,
                });

                // Wait for filtering to happen - row count should change
                cy.get('[data-cy="component-row"]', { timeout: 5000 })
                    .should('have.length.lessThan', initialCount)
                    .and('have.length', 1);

                // Verify the correct component is shown
                cy.get('[data-cy="component-row"]').first().should('contain', 'Component 1');

                // Clear the search
                cy.get('input[data-cy="component-search-box"]')
                    .should('not.be.disabled')
                    .clear({ force: true });

                // Wait for all rows to be visible again
                cy.get('[data-cy="component-row"]', { timeout: 5000 }).should(
                    'have.length',
                    initialCount
                );
            });
    });

    it('should add a new component', () => {
        cy.visit('http://localhost:3000/component');
        cy.waitForAppReady();

        // Wait for page to be ready
        cy.get('[data-theme="novari"]', { timeout: 10000 }).should('exist');
        cy.get('main', { timeout: 10000 }).should('be.visible');
        cy.document().its('readyState').should('eq', 'complete');

        // Verify the table is visible first
        cy.get('[data-cy="component-row"]').should('exist');

        // Verify add button is ready and stable
        cy.get('[data-cy="add-button"]').should('be.visible').and('not.be.disabled');

        // Click using alias to avoid re-render issues
        cy.get('[data-cy="add-button"]').click();

        // Wait for table to disappear (indicates form is showing)
        cy.get('[data-cy="component-row"]', { timeout: 5000 }).should('not.exist');

        // Now wait for form inputs to appear
        cy.get('[data-cy="name-input"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');
        cy.get('[data-cy="description-input"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');
        cy.get('[data-cy="basePath-input"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');

        // Checkboxes have opacity: 0, so check they exist (not visible)
        cy.get('[data-cy="inBeta-checkbox"]', { timeout: 10000 }).should('exist');
        cy.get('[data-cy="common-checkbox"]', { timeout: 10000 }).should('exist');

        // Fill out the form
        cy.get('[data-cy="name-input"]').clear();
        cy.get('[data-cy="name-input"]').type('Component 3');
        cy.get('[data-cy="description-input"]').clear();
        cy.get('[data-cy="description-input"]').type('Test component 3');
        cy.get('[data-cy="basePath-input"]').clear();
        cy.get('[data-cy="basePath-input"]').type('/api/component3');

        // Check the checkboxes
        cy.get('[data-cy="inBeta-checkbox"]').check({ force: true });
        cy.get('[data-cy="common-checkbox"]').check({ force: true });

        // Submit the form
        cy.get('[data-cy="submit-button"]', { timeout: 5000 })
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });

        // Verify we're back at the component table (form closed successfully)
        cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');
    });

    it('should validate component form', () => {
        cy.visit('http://localhost:3000/component');
        cy.waitForAppReady();

        // Click add button to open form
        cy.get('[data-cy="add-button"]').should('be.visible').and('not.be.disabled');

        cy.get('[data-cy="add-button"]').click();

        // Wait for table to disappear
        cy.get('[data-cy="component-row"]', { timeout: 5000 }).should('not.exist');

        // Wait for form to appear
        cy.get('[data-cy="name-input"]', { timeout: 10000 }).should('be.visible');

        // Fill in required fields
        cy.get('[data-cy="name-input"]').clear();
        //cy.get('[data-cy="name-input"]').type('Test Component');
        cy.get('[data-cy="description-input"]').clear();
        //cy.get('[data-cy="description-input"]').type('Test Description');
        cy.get('[data-cy="basePath-input"]').clear();
        //cy.get('[data-cy="basePath-input"]').type('/api/test');

        // // Test cancel button - wait for it to be stable
        // cy.get('[data-cy="cancel-button"]')
        //     .should('be.visible')
        //     .and('not.be.disabled')
        //     .as('cancelBtn');

        //cy.get('@cancelBtn').click({ force: true });

        // // Should be back at table
        // cy.get('[data-cy="component-row"]', { timeout: 10000 }).should('exist');
    });
});
