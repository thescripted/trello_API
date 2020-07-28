var { updateListOrderByDeletedList } = require("./support")

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
    const count = await context.prisma.list.count()
    const data = await context.prisma.list.create({
      data: {
        title: args.title,
        ordernumber: count + 1
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
    const deleted = await context.prisma.list.delete({
      where: {
        list_id: args.id
      }
    })
    const deletedOrderNumber = deleted.ordernumber
    updateListOrderByDeletedList(deletedOrderNumber)
    return `List ID:${deleted.list_id} has been Deleted!`
  },
  dangerouslyDeleteTable: async (parent, args, context, info) => {
    try {
      await context.prisma.list.deleteMany()
      return "Deleted!"
    } catch (err) {
      return err
    }
  },
  addCardToList: async (parent, args, context, info) => {
    const List = await context.prisma.list.findOne({
      where: { list_id: args.list_id }
    })
    const cardcount = await context.prisma.card.count()
    const created = await context.prisma.card.create({
      data: {
        card_id: args.card_id,
        content: args.content,
        count: cardcount,
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
        card_id_list_id: {
          card_id: args.card_id,
          list_id: args.list_id
        }
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
        card_id_list_id: {
          card_id: args.card_id,
          list_id: args.list_id
        }
      }
    })
    return "Card is Deleted!"
  }
}

module.exports = {
  Query,
  Mutation
}
