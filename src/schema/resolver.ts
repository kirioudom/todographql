import { getManager } from "typeorm";
import { Todo } from "../entity/todo.entity";
import { Todo as Itodo } from "./interface.type";
import { ApolloError } from "apollo-server";
const resolvers = {
  Query: {
    allTodo: () => getManager().find(Todo),
    todo: (_, args: Itodo, context, info) => {
      return getManager().findOne(Todo, args.id);
    }
  },
  Mutation: {
    addTodo: async (_, args: Itodo, context, info) => {
      try {
        const newTodo = new Todo();
        newTodo.task = args.task;
        const createdTodo = await getManager().save(newTodo);
        return {
          message: "new todo has been added",
          successed: true,
          todo: createdTodo
        };
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    editTodo: async (_, args: Itodo, context, info) => {
      try {
        const hasTodo = await getManager().findOne(Todo, args.id);
        if (hasTodo) {
          hasTodo.task = args.task;
          return {
            message: "Todo has been update",
            successed: true,
            todo: hasTodo
          };
        }
        throw new Error("Todo does not exist");
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    removeTodo: async (_, args: Itodo, context, info) => {
      try {
        const hasTodo = await getManager().findOne(Todo, args.id);
        if (!hasTodo) {
          throw new Error("Todo doest not exist");
          return;
        }
        await getManager().remove(hasTodo);
        return {
          successed: true,
          message: "Todo has been deleted",
          todo: hasTodo
        };
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    finishTodo: async (_, args: Itodo, context, info) => {
      try {
        const hasTodo = await getManager().findOne(Todo, args.id);
        if (hasTodo) {
          hasTodo.done = true;
          await getManager().save(hasTodo);
          return {
            successed: true,
            message: `${hasTodo.task} is done`,
            todo: hasTodo
          };
        }
        throw new Error("Todo does not exist!");
      } catch (e) {
        throw new ApolloError(e);
      }
    }
  }
};

export default resolvers;
