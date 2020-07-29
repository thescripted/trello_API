var {
  updateListOrderAfterDeleted,
  updateCardOrderAfterDeleted,
  updateListOrderAfterSwap,
  updateCardOrderAfterSwap,
  getCurrentConstants,
  getCountFromListID
} = require("./updater")

const Query = {
  info: () => `This is an example of a resolver`,
  getListsAndCardsData: async (parent, args, { prisma }, info) => {
    const data = await prisma.list.findMany({
      include: {
        card: {
          where: {
            list_id: args.list_id
          }
        }
      }
    })
    return data
  }
}

const Mutation = {
  addList: async (parent, args, context, info) => {
    const LIST_NUMBER_OF_ITEMS = await getCurrentConstants()
    const data = await context.prisma.list.create({
      data: {
        title: args.title,
        ordernumber: LIST_NUMBER_OF_ITEMS + 1
      }
    })
    return data
  },
  updateList: async (parent, args, context, info) => {
    const data = await context.prisma.list.update({
      where: {
        list_id: args.id
      },
      data: {
        title: args.title
      }
    })
    return data
  },
  deleteList: async (parent, args, context, info) => {
    const List = await context.prisma.list.delete({
      where: {
        list_id: args.id
      }
    })
    updateListOrderAfterDeleted(List)
    return `List ID:${List.list_id} has been Deleted!`
  },

  addCardToList: async (parent, args, context, info) => {
    const CARD_IN_LIST = await getCountFromListID(args.list_id)

    const created = await context.prisma.card.create({
      data: {
        card_id: args.card_id,
        content: args.content,
        ordernumber: CARD_IN_LIST + 1,
        list: {
          connect: {
            list_id: args.list_id
          }
        }
      }
    })
    console.log(created)
    return created
  },
  updateCardInList: async (parent, args, context, info) => {
    const Card = await context.prisma.card.update({
      where: {
        card_id: args.card_id
      },
      data: {
        content: args.content
      }
    })
    return Card
  },
  deleteCardFromList: async (parent, args, context, info) => {
    const Card = await context.prisma.card.delete({
      where: {
        card_id: args.card_id
      }
    })
    updateCardOrderAfterDeleted(Card)
    return `Card ID:${Card.card_id} is Deleted!`
  },

  dangerouslyDeleteTable: async (parent, args, context, info) => {
    try {
      await context.prisma.list.deleteMany()
      return "Your Entire Table is Deleted!"
    } catch (err) {
      return err
    }
  }
}

module.exports = {
  Query,
  Mutation
}
