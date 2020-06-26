var PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

async function main() {
    // const newItem = await prisma.list.update({
    //     where: {id: 1},
    //     data: {
    //         title: 'Okay, Boomer'
    //     }
    // })

    console.log(await prisma.list.findMany())
}

main()
    .catch(err => {
        throw err
    })
    .finally(async () => await prisma.disconnect())
