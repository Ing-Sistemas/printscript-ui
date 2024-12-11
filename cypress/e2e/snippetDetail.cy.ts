import * as url from "node:url";

const BACKEND_URL = Cypress.env('BACKEND_URL')
describe('Add snippet tests', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      return false
    })

    cy.loginToAuth0(
        Cypress.env("AUTH0_USERNAME"),
        Cypress.env("AUTH0_PASSWORD")
    )
    const fullURL = BACKEND_URL + "/get_all?page=0&pageSize=10&snippetName="
    console.log(fullURL)
    cy.intercept('GET', fullURL)
        .as("getSnippets")

    cy.visit("/")

    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.wait("@getSnippets")

    cy.get('body').click(0, 0)
    // cy.wait(2000) // TODO comment this line and uncomment 19 to wait for the real data
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
  })

  it('Can share a snippet ', () => {
    cy.wait(10000)
    cy.get('[aria-label="Share"]').click();
    cy.get('.css-1h51icj-MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input').click();
    cy.get('.css-gdh49b-MuiAutocomplete-listbox .MuiAutocomplete-option').first().click();
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').click();
  })

  it('Can format snippets', function() {
    cy.wait(10000)
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {
    cy.wait(10000)
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.wait(10000)
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})