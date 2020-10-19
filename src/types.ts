import Knex from "knex";
import { Logger as WinstonLogger } from "winston";

import { BooksRepository } from "db/books";

export { ValidationError, DuplicateEntryError } from "./errors";

export type DB = Knex;
export type Logger = WinstonLogger;

export interface HandlerDeps {
  logger: Logger;
  booksRepository: BooksRepository;
}

export interface HandlerProps<Context> extends HandlerDeps {
  context: Context;
}

export interface IAuthor {
  id: number;
  name: string;
}

export interface IBook {
  id: number;
  title: string;
  authors: IAuthor[];
}