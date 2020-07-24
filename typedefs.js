const typeDefs = `
type Query {
    info: String!
    getListsAndCardsData: [List!]!
}

type Mutation {
    addList(title: String): List!
    updateList(id: Int, title: String): List!
    deleteList(id: Int): String!
    dangerouslyDeleteTable: String!
    addCardToList(list_id: Int!, content: String): Card!
    updateCardInList(cardId: Int, listId: Int, cardTitle: String): Card!
    deleteCardInList(cardId: Int, listId: Int): String!
}

type List {
    createdat: String!
    list_id: ID!
    title: String!
    card: [Card!]
}

type Card {
    content: String!
    createdat: String!
    updatedat: String
    card_id: ID!
    list_id: Int!
    list: List!
}
`

module.exports = {
  typeDefs
}
