import { getManager } from "typeorm";
import { Todo } from "../entity/todo.entity";
import { Todo as Itodo } from "./interface.type";

const resolvers = {
  Query: {
    allTodo: () => getManager().find(Todo),
    todo: (_, args: Itodo, context, info) => {
      return getManager().findOne(Todo, args.id);
    }
  }
};

export default resolvers;
