import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import expressGraphQL from "express-graphql";
import { rootSchema } from "./schema/schema";
import cors from "cors";

const app = express();

const main = async () => {
  try {
    const connect = await createConnection();
    console.log("database is connected");
  } catch (e) {
    throw new Error("Can't connect database");
  }
  return connect;
};

main().catch(e => console.log(e));
app.use(cors());

app.use(
  "/graphql",
  expressGraphQL({
    schema: rootSchema,
    graphiql: true
  })
);

app.listen(3500, () => {
  console.log("server has started");
});
