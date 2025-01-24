/// <reference types="cypress" />
import {topBarPage} from "../support/POM/topBarPage"
import {articleCreationPage} from "../support/POM/articleCreationPage"

describe("Intercept and Mocked API Tests", ()=>{
  
  const apiUrl = Cypress.config("apiUrl")
  const apiArticlesUrl = apiUrl+"/articles"
  const apiTagsUrl = apiUrl+"/tags"

    beforeEach("Loguearse", () =>{
        cy.loginThroughApi()
    })

    it("Create an article and verify API is being called", ()=>{
        cy.intercept("POST",apiArticlesUrl).as("postArticle")

        //create an article
        topBarPage.goToNewArticle()
        articleCreationPage.createAnArticle()

        cy.wait("@postArticle").then(intercept =>{
            expect(intercept.response.statusCode).to.eq(201)
            expect(intercept.request.body.article.title).to.eq(articleCreationPage.getArticleTitle())
            expect(intercept.request.body.article.body).to.eq(articleCreationPage.getArticleBody())
            expect(intercept.request.body.article.description).to.eq(articleCreationPage.getArticleDescription())
        })
        //delete the article so the next time the test run it can be created again
        cy.contains("button", "Delete Article").click()
    })

    it.only("Verify tags are shown correctly", ()=>{
        let expectedTags
        cy.intercept("GET", apiTagsUrl).as("tags")
        
        cy.wait("@tags").then(intercept =>{
            expectedTags = intercept.response.body.tags
        })
        cy.get(".tag-list").find("a").then(tags =>{
            expect(tags.length).to.eq(expectedTags.length)
            cy.wrap(tags).each(tag =>{
                cy.wrap(tag).invoke("text").then(txt =>{
                    expect(expectedTags).contains(txt.trim())
                })
            })
        })
    })

    it("Intercept an API call and change the request", ()=>{
        cy.intercept("POST",apiArticlesUrl, req =>{
            req.body.article.description = "intercepted and changed"
        }).as("postArticle")

        //create an article
        topBarPage.goToNewArticle()
        articleCreationPage.createAnArticle()

        cy.wait("@postArticle").then(intercept =>{
            expect(intercept.request.body.article.description).to.eq("intercepted and changed")
        })
        //delete the article so the next time the test run it can be created again
        cy.contains("button", "Delete Article").click()
    })

    it("Intercept an API call and change the response from the server", ()=>{
        cy.intercept("POST",apiArticlesUrl, req =>{
            req.reply( res =>{
                expect(res.body.article.description).to.eq(articleCreationPage.getArticleDescription())
                res.body.article.description = "response changed"
            })
        }).as("postArticle")

        //create an article
        topBarPage.goToNewArticle()
        articleCreationPage.createAnArticle()

        cy.wait("@postArticle").then(intercept =>{
            expect(intercept.response.body.article.description).to.eq("response changed") //INTERCEPT THE RESPONSE
        })
        //delete the article so the next time the test run it can be created again
        cy.contains("button", "Delete Article").click()
    })
})