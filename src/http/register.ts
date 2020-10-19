import { Express } from "express";

import { HandlerDeps } from "types";
import httphandler from "./httphandler";
import * as handlers from "../handlers";

export default function register(app: Express, props: HandlerDeps) {
  const handler = httphandler(props);

  // app.get("/books/:id", handler(handlers.getBookByID));
  app.get("/books", handler(handlers.getBooks));
  app.post("/books", handler(handlers.createBook));
  // app.post("/books/:id", handler(handlers.updateBook));
}
