var PrismaClient = require("@prisma/client").PrismaClient
const prisma = new PrismaClient()

let CARD_NUMBER_OF_ITEMS = 0
let LIST_NUMBER_OF_ITEMS = 0

async function initialize_constants() {
  const listcount = await prisma.list.count()
  LIST_NUMBER_OF_ITEMS = listcount

  const cardcount = await prisma.card.count()
  CARD_NUMBER_OF_ITEMS = cardcount
}

async function updateListOrderByDeletedList(deletedOrderNumber) {
  for (let order = deletedOrderNumber; order <= LIST_NUMBER_OF_ITEMS; order++) {
    await prisma.list.update({
      select: {
        ordernumber: order
      },
      data: {
        ordernumber: order - 1
      }
    })
  }
  LIST_NUMBER_OF_ITEMS--
}

module.exports = {
  prisma,
  initialize_constants,
  updateListOrderByDeletedList
}
