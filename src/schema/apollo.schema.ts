import { gql } from "apollo-server";

const typeDefs = gql`
  type Todo {
    id: String
    task: String
    done: Boolean
  }
  type Query {
    allTodo: [Todo]!
    todo(id: String): Todo
  }
`;

export default typeDefs;
