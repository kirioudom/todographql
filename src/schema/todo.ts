import { gql, ApolloError } from "apollo-server";
import { User } from "../entity/user.entity";
import { Todo } from "../entity/todo.entity";
import { getManager } from "typeorm";
import { Todo as Itodo, User as Iuser, UserID } from "./interface.type";

export const TodoTypeDef = gql`
  type Todo {
    id: String
    task: String
    done: Boolean
    user: User
  }

  type AddTodoResponse implements MutationResponse {
    successed: Boolean!
    message: String!
    todo: Todo!
  }

  type EditTodoResponse implements MutationResponse {
    successed: Boolean!
    message: String!
    todo: Todo!
  }

  type RemoveTodoResponse implements MutationResponse {
    successed: Boolean!
    message: String!
  }
  type FinishTodoResponse implements MutationResponse {
    successed: Boolean!
    message: String!
    todo: Todo!
  }

  extend type Query {
    allTodo: [Todo]!
    todo(id: String): Todo
  }

  extend type Mutation {
    addTodo(task: String!, userID: String!): AddTodoResponse!
    removeTodo(id: String!): RemoveTodoResponse!
    editTodo(id: String!, task: String!): EditTodoResponse!
    finishTodo(id: String!): FinishTodoResponse!
  }
`;

export const resolver = {
  Query: {
    allTodo: () => getManager().find(Todo),
    todo: (_, args: Itodo, context, info) => {
      return getManager().findOne(Todo, args.id);
    }
  },
  Todo: {
    user: async (parents, args, context, info) => {
      const todo = await getManager().findOne(Todo, {
        where: { id: parents.id },
        relations: ["user"]
      });
      if (todo && todo.user) {
        return todo.user;
      }
      return null;
    }
  },
  Mutation: {
    addTodo: async (_, args: Itodo, context, info) => {
      try {
        const user = await getManager().findOne(User, args.id);
        const newTodo = new Todo();
        if (user) {
          console.log(`User found ${Object.values(user)}`);
          newTodo.task = args.task;
          newTodo.user = user;
          await getManager().save(newTodo);
          return {
            message: "new todo has been added",
            successed: true,
            todo: newTodo
          };
        }
        throw new Error(
          "You have to create User first before you ara able to have todo"
        );
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
            message: `mark ${hasTodo.task} is done`,
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
