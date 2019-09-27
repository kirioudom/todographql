import { gql } from "apollo-server";

const typeDefs = gql`
  type Todo {
    id: String
    task: String
    done: Boolean
  }
  interface MutationResponse {
    successed: Boolean!
    message: String!
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

  type Query {
    allTodo: [Todo]!
    todo(id: String): Todo!
  }
  type Mutation {
    addTodo(task: String!): AddTodoResponse!
    removeTodo(id: String!): RemoveTodoResponse!
    editTodo(id: String!, task: String!): EditTodoResponse!
    finishTodo(id: String!): FinishTodoResponse!
  }
`;

export default typeDefs;
