/// <reference types="cypress" />
import theArticle from "../fixtures/anArticle.json"

describe("Mocked API Tests", ()=>{
    var slugId
    var userToken
    const apiUrl = Cypress.config("apiUrl")
    const apiArticlesUrl = apiUrl+"/articles/"

    beforeEach("Loguearse", ()=>{
        /* IMPORTANT: The intercept needs to be placed in the code before the page call the actual API 
        endpoint. In this case as soon as the page opens this endpoint will be called so I need to call 
        the mock before entering the website.
        I will intercept this endpoint because it contains the JWT token that I will later need in the test
        */
        cy.intercept({method: "POST", path: "login"}).as("login")
        cy.loginToApplication()
    })

    it.only("Delete an article, but creating it through API", ()=>{
        cy.wait("@login").then(loginCall =>{
            userToken = loginCall.response.body.user.token
            cy.request({
                url: apiArticlesUrl,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token "+userToken
                },
                method: "POST",
                body: theArticle
            }).then( response =>{
                expect(response.status).to.eq(201)
                slugId = response.body.article.slug;
            })
            cy.contains("h1",theArticle.article.title).click()
            cy.intercept("DELETE",apiArticlesUrl+"/*").as("deleteArti")
            cy.contains("button","Delete Article").click()
            cy.wait("@deleteArti").then(xhr =>{
                expect(xhr.response.statusCode).to.eq(204)   
            })
        })
    })

    afterEach("Make sure the article got deleted if the test failed", ()=>{
        if (Cypress.mocha.getRunner().suite.ctx.currentTest.state === 'failed') {
            cy.deleteArticleViaApi(userToken, slugId);
        }       
    })

})