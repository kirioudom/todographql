import { gql } from "apollo-server";
import { TodoTypeDef, resolver as todoResolver } from "./todo";
import { UserTypeDefs, resolver as userResolver } from "./user";

const linkSchemas = gql`
  interface MutationResponse {
    successed: Boolean!
    message: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const resolvers = [todoResolver, userResolver];

export const typeDefs = [linkSchemas, TodoTypeDef, UserTypeDefs];
