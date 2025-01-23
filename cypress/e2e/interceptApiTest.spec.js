/// <reference types="cypress" />

describe("Intercept, Mock and Assert 2", ()=>{
    const apiUrl = Cypress.config("apiUrl")

    beforeEach("Loguearse", ()=>{
        cy.intercept("GET", apiUrl+"/articles*", {fixture: "articles.json"}) //Intercept this for the first test
        cy.logInToApplication()
    })

    //If I consider this test as flaky I can put a specific retries option regardless the cypress config
    it("Mock two articles, increase the likes counter and verify through Frontend", {retries:1}, ()=>{        
        //I get MY mocked article, that has 5 fav count, when I click it should go to 6
        cy.contains("a[class='author']","Federico Pantaleone").parent().parent().find("button").then(button =>{
            cy.wrap(button).invoke("text").then(txt =>{
                expect(txt.trim()).to.eq("5")
            })    
        })

        cy.fixture("articles").then(file=>{
            const articleLink = file.articles[0].slug
            file.articles[0].favoritesCount = 6
            cy.intercept("POST","https://conduit-api.bondaracademy.com/api/articles/"+articleLink+"/favorite",file)
        })  
        
        cy.contains("a[class='author']","Federico Pantaleone").parent().parent().find("button").then(button =>{
            cy.wrap(button).click()
            cy.wrap(button).invoke("text").then(txt =>{
                expect(txt.trim()).to.eq("6")
            })    
        })
    })
})

describe("Intercept, Mock and Assert ex.2", ()=>{
    const apiUrl = Cypress.config("apiUrl")
    const apiTagsUrl = apiUrl+"/tags"

    beforeEach("Loguearse", ()=>{
        /* IMPORTANT: The intercept needs to be placed in the code before the page call the actual API endpoint. 
        In this case as soon as the page opens this endpoint will be called so I need to call the mock before entering the website.
        */
        cy.intercept("GET", apiTagsUrl, {fixture: "mockedTags.json"})
        //cy.intercept({method: "Get", path: "tags"}, {fixture: "mockedTags.json"})) This also works
        cy.logInToApplication()
    })

    it("Inject mocked tags and verify them through the Frontend", ()=>{
        cy.fixture("mockedTags.json").then(mockedTags =>{
            cy.get(".tag-list").find("a").each(tag =>{
                cy.wrap(tag).invoke("text").then(txt =>{
                    expect(mockedTags.tags).contains(txt.trim())
                })
            })
        })
    })
})