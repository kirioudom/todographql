import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import { typeDefs, resolvers } from "./schema/index";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
const expressApp = express();
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
expressApp.use(cors());
expressApp.use(bodyParser.json());
apolloServer.applyMiddleware({ app: expressApp, path: "/graphql" });

expressApp.use((err, req, res, next) => {
  console.log(err);
});

expressApp.listen(3500, () => {
  console.log(`server has started on port 3500`);
});
