export class ArticleCreationPage {
    articleTitle = "Test article"
    articleBody = "Stephen King is the best writting SciFi novels"
    articleDescription = "Science Fiction"

    getArticleTitle(){
        return this.articleTitle
    }

    getArticleBody(){
        return this.articleBody
    }

    getArticleDescription(){
        return this.articleDescription
    }

    createAnArticle(){
        cy.get("[formcontrolname='title']").type(this.getArticleTitle())
        cy.get("[formcontrolname='description']").type(this.getArticleDescription())
        cy.get("[formcontrolname='body']").type(this.getArticleBody())
        cy.get("[placeholder='Enter tags']").type("books,scifi")
        cy.contains("button","Publish Article").click();
    }
}

export const articleCreationPage = new ArticleCreationPage()