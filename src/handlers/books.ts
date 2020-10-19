import * as yup from "yup";

import { HandlerProps, IBook } from "../types";
import validate from "./validate";

type GetBooksProps = HandlerProps<{
  query: {
    skip?: number;
    take?: number;
  };
}>;

const getBooksQuerySchema = yup.object().shape({
  skip: yup.number().min(0),
  take: yup.number().min(1).max(50),
});

export async function getBooks({
  context,
  booksRepository,
}: GetBooksProps): Promise<IBook[]> {
  const { query } = context;
  await validate(getBooksQuerySchema, query);

  const { skip, take } = query;
  return booksRepository.getBooks({ skip, take });
}

type CreateBookProps = HandlerProps<{
  body: {
    title: string;
    description: string;
    authors: string[];
  };
}>;

const createBookBodySchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  authors: yup.array().of(yup.string()),
});

export async function createBook({
  logger,
  context,
  booksRepository,
}: CreateBookProps): Promise<IBook> {
  const { body } = context;
  await validate(createBookBodySchema, body);
  return await booksRepository.createBook(body);
}
