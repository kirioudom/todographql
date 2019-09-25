import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList
} from "graphql";
import { getManager } from "typeorm";
import { Todo as TodoModel } from "../entity/todo.entity";

export const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLString },
    task: { type: GraphQLString },
    done: { type: GraphQLBoolean }
  })
});

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    allTodos: {
      type: new GraphQLList(TodoType),
      resolve() {
        return getManager().find(TodoModel);
      }
    },
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args, context, info) {
        return getManager().findOne(TodoModel, args.id);
      }
    }
  })
});

const EditResponseType = new GraphQLObjectType({
  name: "EditResponseType",
  fields: () => ({
    successed: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  })
});

const FinishTaskResponseType = new GraphQLObjectType({
  name: "FinishTaskResponseType",
  fields: () => ({
    successed: { type: GraphQLBoolean }
  })
});

const DeletedResponseType = new GraphQLObjectType({
  name: "DeletedResponse",
  fields: () => ({
    message: { type: GraphQLString },
    isDelete: { type: GraphQLBoolean }
  })
});

const rootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodo: {
      type: TodoType,
      args: { task: { type: GraphQLString } },
      async resolve(_, { task }) {
        const enitityTodo = getManager();
        const newTodo = new TodoModel();
        newTodo.task = task;
        const createSuccessed = await enitityTodo.save(newTodo);
        return createSuccessed;
      }
    },
    removeTodo: {
      type: DeletedResponseType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, { id }) {
        const todo = await getManager().findOne(TodoModel, id);
        if (!todo) {
          return { message: "Todo doesn't exist" };
        }
        const isRemoved = await getManager().remove(todo);
        return { message: "remove successed" };
      }
    },
    finishTask: {
      type: FinishTaskResponseType,
      args: { id: { type: GraphQLString } },
      async resolve(_, { id }) {
        const finishTodo = await getManager().findOne(TodoModel, id);
        if (finishTodo) {
          finishTodo.done = true;
          await getManager().save(finishTodo);
          return { successed: true };
        }
        return { successed: false };
      }
    },
    editTodo: {
      type: EditResponseType,
      args: { id: { type: GraphQLString }, task: { type: GraphQLString } },
      async resolve(_, { id, task }) {
        const isFoundTodo = await getManager().findOne(TodoModel, id);
        if (isFoundTodo) {
          isFoundTodo.task = task;
          return { successed: true, message: "Complete Edit" };
        }
        return { successed: false, message: "Todo does not exist!!" };
      }
    }
  }
});

const rootSchema = new GraphQLSchema({
  query: queryType,
  mutation: rootMutation
});

export { rootSchema };
