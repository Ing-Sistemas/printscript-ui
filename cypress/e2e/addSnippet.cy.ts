// import {BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      return false
    })

    console.log('Logging in to AUTH0')
    cy.loginToAuth0(
        Cypress.env('AUTH0_USERNAME'),
        Cypress.env('AUTH0_PASSWORD')
    )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
    const backendUrl = Cypress.env("BACKEND_URL")
    const url = backendUrl + "/create"
    cy.intercept('POST', url, (req) => {
      req.reply((res) => {
        req.headers = {'Authorization': `Bearer ${localStorage.getItem("token")}`}
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');


    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('body').click();
    cy.get('[data-testid="menu-option-PrintScript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`const snippet: string = "some snippet"; \n println(snippet);`);
    cy.get('[data-testid="SaveIcon"]').click();
    cy.wait('@postRequest').its('response.statusCode').should('eq', 200); // Should create snippet
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    const backendUrl2 = Cypress.env("BACKEND_URL")
    const url2 = backendUrl2 + "/create"
    cy.intercept('POST', url2, (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem('token')}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');


    /* ==== Generated with Cypress Studio ==== */
    const backendUrl = Cypress.env("BACKEND_URL")
    // Wait for snippets to load
    const url = backendUrl + "/get_all?page=0&pageSize=10&snippetName="


    cy.intercept('GET', url, (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem("token")}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');
    cy.get('.css-9jay18 > .MuiButton-root').click();

    cy.wait("@getSnippets")
    cy.get('[data-testid="upload-file-input"').selectFile("cypress/fixtures/example_ps.ps", {force: true})

    cy.get('[data-testid="SaveIcon"]').click();
    cy.wait(4000)
    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})