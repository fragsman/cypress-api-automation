/// <reference types="cypress" />

describe("Mocked API Tests", ()=>{
    
    const apiUrl = Cypress.config("apiUrl")
    const apiTagsUrl = apiUrl+"/tags"

    beforeEach("Loguearse", ()=>{
        /* IMPORTANT: The intercept needs to be placed in the code before the page call the actual API 
        endpoint. In this case as soon as the page opens this endpoint will be called so I need to call 
        the mock before entering the website.
        */
        cy.intercept("GET", apiTagsUrl, {fixture: "mockedTags.json"})
        //cy.intercept({method: "Get", path: "tags"}, {fixture: "mockedTags.json"})) This also works
        cy.logInToApplication()
    })

    it.only("See the tags are mocked", ()=>{
        cy.fixture("mockedTags.json").then(mockedTags =>{
            cy.get(".tag-list").find("a").each(tag =>{
                cy.wrap(tag).invoke("text").then(txt =>{
                    expect(mockedTags.tags).contains(txt.trim())
                })
            })
        })
    })
})