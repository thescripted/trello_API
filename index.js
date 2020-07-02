var PrismaClient = require('@prisma/client').PrismaClient
var GraphQLServer = require('graphql-yoga').GraphQLServer

const prisma = new PrismaClient()
const typeDefs = `
type Query {
    info: String!
    getAllLists: [List!]!
}

type List {
    createdAt: Int!
    id: ID!
    title: String!
}
`

const resolvers = {
    Query: {
        info: () => `This is an example of a resolver`,
        getAllLists: async (parent, args, context, info) => {
            const data = await context.prisma.list.findMany()
            data.map(item => {
                delete item.createdAt // TODO: Change CreatedAt to appropriate Timestamp.
            })
            return data
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
