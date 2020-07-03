var PrismaClient = require('@prisma/client').PrismaClient
var GraphQLServer = require('graphql-yoga').GraphQLServer

const prisma = new PrismaClient()
const typeDefs = `
type Query {
    info: String!
    getAllLists: [List!]!
}

type Mutation {
    addList(list_id: Int, title: String): List!
    updateList(id: Int, title: String): List!
    deleteList(id: Int): Boolean!
    dangerouslyDeleteTable: String!
    addCardToList(listId: Int, cardTitle: String): Int!
    updateCardInList(cardId: Int, listId: Int, cardTitle: String): Int!
    deleteCardInList(cardId: Int, listId: Int): Int!
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
    id: ID!
    listId: Int!
    list: List!
}
`

const resolvers = {
  Query: {
    info: () => `This is an example of a resolver`,
    getAllLists: async (parent, args, context, info) => {
      const data = await context.prisma.list.findMany()
      return data
    }
  },
  Mutation: {
    addList: async (parent, args, context, info) => {
      try {
        const data = await context.prisma.list.create({
          data: {
            list_id: args.list_id,
            title: args.title
          }
        })
        return data
      } catch (err) {
        return err
      }
    },
    updateList: async (parent, args, context, info) => {
      const data = await context.prisma.list.update({
        where: {
          id: args.id
        },
        data: {
          title: args.title
        }
      })
      return data
    },
    deleteList: async (parent, args, context, info) => {
      try {
        await context.prisma.list.delete({
          where: {
            id: args.id
          }
        })
        return true
      } catch (err) {
        return false
      }
    },
    dangerouslyDeleteTable: async (parent, args, context, info) => {
      try {
        await context.prisma.list.deleteMany()
        console.log('Deleted!')
      } catch (err) {
        return err
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { prisma }
})

const options = {
  port: 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptons',
  playground: '/playground'
}

async function main() {
  // const newItem = await prisma.list.update({
  //     where: {id: 1},
  //     data: {k
  //         title: 'Okay, Boomer'
  //     }
  // })
  server.start(options, ({ port }) =>
    console.log(
      `Server started, listening on localhost:${port} for incoming requests.`
    )
  )
}

main()
  .catch(err => {
    throw err
  })
  .finally(async () => {
    await prisma.disconnect()
  })
