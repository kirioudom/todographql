import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import expressGraphQL from "express-graphql";
import { rootSchema } from "./schema/schema";
import cors from "cors";
import { ApolloServer } from "apollo-server";
import resolvers from "./schema/resolver";
import typeDefs from "./schema/apollo.schema";
const app = express();
const apolloServer = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
  try {
    const connect = await createConnection();
    console.log("database is connected");
    return connect;
  } catch (e) {
    throw new Error("Can't connect database");
  }
};

main().catch(e => console.log(e));
// app.use(cors());

// app.use(
//   "/graphql",
//   expressGraphQL({
//     schema: rootSchema,
//     graphiql: true
//   })
// );

apolloServer.listen().then(({ url }) => {
  console.log(`server has started at port ${url}`);
});
// app.listen(3500, () => {
//   console.log("server has started");
// });
