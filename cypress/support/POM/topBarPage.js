///<reference types="cypress" />

export class TopBarPage{

    goToNewArticle(){
        cy.contains("a","New Article").click()
    }
}

export const topBarPage = new TopBarPage()