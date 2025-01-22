// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("navigateWithoutLogin", ()=>{
  cy.visit("/")
})

Cypress.Commands.add("logInToApplication", ()=>{
    cy.visit("/login")
    cy.get("[placeholder='Email']").type(Cypress.env("username"))
    cy.get("[placeholder='Password']").type(Cypress.env("password"))
    cy.get("form").submit()
})

Cypress.Commands.add("loginThroughApi", () => {
    const userCredentials = {
      user: {
        email: Cypress.env("username"),
        password: Cypress.env("password"),
      },
    };
    cy.request(
      "POST",
      Cypress.config("apiUrl")+"/users/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        const token = body.user.token;
        cy.visit("/", {
          onBeforeLoad(win) {
            win.localStorage.setItem("jwtToken", token);
          },
        });
      });
  });
  
  Cypress.Commands.add("deleteArticleViaApi", (userToken, slugId) => {
    cy.request({
      url: Cypress.config("apiUrl")+"/articles/" + slugId,
      method: "DELETE",
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  });