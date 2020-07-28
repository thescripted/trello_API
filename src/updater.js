//This file handles all necessary update to the database, typically after a resolver has executed.
// Example: Deleting a list or a card will trigger a function to update the database with the correct ordering.
// Right now, these are APIs exposed to the resolvers, in the future this file should be "watching" any resolvers executions and automatically updating itself.

var PrismaClient = require("@prisma/client").PrismaClient
const prisma = new PrismaClient()

let CARD_NUMBER_OF_ITEMS_PER_LIST = 0
let LIST_NUMBER_OF_ITEMS = 0

async function getCurrentConstants() {  // This should be the ONLY function that updates the # of item variables. 
  LIST_NUMBER_OF_ITEMS = await prisma.list.count()
  CARD_NUMBER_OF_ITEMS_PER_LIST = await prisma.card.count()
  return { CARD_NUMBER_OF_ITEMS_PER_LIST, LIST_NUMBER_OF_ITEMS }
}

async function updateListOrderAfterDeleted(DeletedList) { // Args: Most recently deleted List.
  deletedOrderNumber = DeletedList.ordernumber
  
  await get_current_constants() // get correct # of lists
  for (
    let order = deletedOrderNumber + 1;
    order <= LIST_NUMBER_OF_ITEMS + 1;
    order++
  ) {
    let id = await prisma.list.findMany({
      where: {
        ordernumber: order
      },
      take: 1
    })

    id = id[0].list_id
    await prisma.list.update({
      where: {
        list_id: id
      },
      data: {
        ordernumber: order - 1
      }
    })
  }
}

async function updateCardOrderAfterDeleted(DeletedCard) { // Input is the card that was just deleted
  // 1) Find All Cards in the correct List_id of deleted card.
  // 2) Loop through those cards and subtract one from their order number.
};

async function updateCardOrderAfterSwap(source, destination) {
  // 1) Determine if swap is internal or cross-list.
  // 2.1) If Cross-List, hope and pray and beg for mercy.
  // 2.2) If Internal, determine if swap source is going up or down
  // 3.2) based on that, determine the order between the source & destination. You've wrote this code before. Update those order.
}; 

async function updateListOrderAfterSwap(source, destination); {
  // 1) Similar to (2.2) for updateCardOrderAfterSwap
}

module.exports = {
  prisma,
  getCurrentConstants,
  updateListOrderAfterDeleted,
  updateCardOrderAfterDeleted,
  updateListOrderAfterSwap,
  updateCardOrderAfterSwap,
}
