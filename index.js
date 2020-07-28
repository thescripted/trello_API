var GraphQLServer = require("graphql-yoga").GraphQLServer
var resolvers = require("./src/resolvers")
var { prisma, getCurrentConstants } = require("./src/updater")

getCurrentConstants() // Initializes current card & list counts
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
