var PrismaClient = require("@prisma/client").PrismaClient
var GraphQLServer = require("graphql-yoga").GraphQLServer
var resolvers = require("./src/resolvers")

// To Talk to the database
const prisma = new PrismaClient()

//GraphQL Constructor
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
})

const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptons",
  playground: "/playground"
}

async function main() {
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
