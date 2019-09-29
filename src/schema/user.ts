import { gql } from "apollo-server";
import { getManager } from "typeorm";
import { Todo } from "../entity/todo.entity";
import { User } from "../entity/user.entity";
import { UserID } from "./interface.type";

export const UserTypeDefs = gql`
  type User {
    id: String!
    lastName: String!
    firstName: String!
    todos: [Todo]!
  }

  type EditUserResponse implements MutationResponse {
    successed: Boolean!
    message: String!
    user: User!
  }
  type CreateUserResponse implements MutationResponse {
    successed: Boolean!
    message: String!
    user: User!
  }

  type RemoveUserResponse implements MutationResponse {
    successed: Boolean!
    message: String!
  }

  extend type Query {
    users: [User]!
    user(id: String!): User
  }

  extend type Mutation {
    createUser(firstName: String!, lastName: String!): User!
    editUser(firstName: String!, lastName: String!): EditUserResponse!
    removeUser(userID: String!): RemoveUserResponse!
  }
`;

export const resolver = {
  Query: {
    users: async () => {
      const allUser = await getManager().find(User);
      return allUser;
    },
    user: (_, args: UserID, context, info) => {
      return getManager().findOne(User, args.id);
    }
  },
  Mutation: {
    createUser: async (_, args, context, info) => {
      const user = new User();
      user.firstName = args.firstName;
      user.lastName = args.lastName;
      return await getManager().save(user);
    }
  },
  User: {
    todos: async (parent, args, context, info) => {
      const todoOfUser = await getManager().find(Todo, {
        where: { user: parent.id }
      });
      console.log(todoOfUser);
      return todoOfUser;
    }
  }
};
