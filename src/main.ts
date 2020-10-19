import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import Knex from "knex";

import { getConfig } from "./config";
import { register } from "./http";
import { dbSchema } from "./db";
import { BooksRepository } from "./db/books";
import logger from "./logger";

const config = getConfig({
  mysql: {
    // Only use in development. Use of `usernameFile` is recommended in production.
    username: process.env.MYSQL_USER,
    // Recommended in production. `username` will take precedence over `usernameFile` field if both value exists.
    usernameFile: process.env.MYSQL_USER_FILE,
    // Only use in development. Use of `passwordFile` is recommended in production.
    password: process.env.MYSQL_PASSWORD,
    // Recommended in production. `password` will take precedence over `passwordFile` field if both value exists.
    passwordFile: process.env.MYSQL_PASSWORD_FILE,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
  },
  app: {
    port: process.env.PORT,
  },
});

const knex = Knex({
  client: "mysql",
  connection: {
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    multipleStatements: true,
  },
  pool: {
    min: 0,
    max: 10,
  },
  acquireConnectionTimeout: 10000,
});

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

register(app, {
  logger: logger,
  booksRepository: new BooksRepository({ db: knex }),
});

app.listen(config.appPort, () => {
  logger.info(`Listening on port ${config.appPort}`);
  knex
    .raw(dbSchema)
    .then(() => {
      logger.info("Initialized database");
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
});
