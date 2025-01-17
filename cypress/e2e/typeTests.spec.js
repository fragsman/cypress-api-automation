///<reference types="cypress"/>

describe("Typing tests", ()=>{

    it("Using hotkeys", ()=>{
        //In this page pressing Ctrl+K will open a search box. I want to simulate that
        cy.visit("https://docs.cypress.io/api/commands/type")
        cy.wait(5000)

        //Option 1
        cy.get("body").type("{ctrl+k}")
        cy.get(".DocSearch-Input").type("intercept")
        cy.get("#docsearch-item-0").focus().click()
        
        //Option 2
        //cy.get('body').trigger('keydown', { ctrlKey: true, keyCode: 75}) //75 = K
        
        //Option 3
        //cy.get('body').trigger('keydown', { keyCode: 17, release : false}) //17 = Ctrl
        //cy.get('body').trigger('keydown', { keyCode: 75, release : false}) //75 = K

        //Option 4
        //cy.get('body').trigger('keydown', { eventConstructor: "KeyboardEvent", ctrlKey: true, keyCode: 75}) //75 = K

        //Option 5
        //cy.get('body').trigger('keydown', { eventConstructor: "KeyboardEvent", keyCode: 17, release : false}) //17 = Ctrl
        //cy.get('body').trigger('keydown', { eventConstructor: "KeyboardEvent", keyCode: 75}) //75 = K
    })
})