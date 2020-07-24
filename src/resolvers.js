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
    const data = await context.prisma.list.create({
      data: {
        title: args.title
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
    await context.prisma.list.delete({
      where: {
        list_id: args.id
      }
    })
    return "List Deleted!"
  },
  dangerouslyDeleteTable: async (parent, args, context, info) => {
    try {
      await context.prisma.list.deleteMany()
      console.log("Deleted!")
    } catch (err) {
      return err
    }
  },
  addCardToList: async (parent, args, context, info) => {
    const List = await context.prisma.list.findOne({
      where: { list_id: args.list_id }
    })
    const created = await context.prisma.card.create({
      data: {
        card_id: args.card_id,
        content: args.content,
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
