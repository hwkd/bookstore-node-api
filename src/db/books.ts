import { DB, IBook, DuplicateEntryError } from "../types";

export const schema = `
CREATE TABLE IF NOT EXISTS books (
  id INT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY title (title)
);
`;

interface RepositoryProps {
  db: DB;
}

interface CreateBookProps {
  title: string;
  description: string;
}

interface UpdateBookProps {
  id: number;
  title: string;
  description: string;
}

interface GetBooksProps {
  skip?: number;
  take?: number;
}

export class BooksRepository {
  db: DB;
  table: string;

  constructor({ db }: RepositoryProps) {
    this.db = db;
    this.table = "books";
  }

  // Create single book record and return the created record.
  async createBook(props: CreateBookProps): Promise<IBook> {
    const { db, table } = this;

    let bookID;
    try {
      const result = await db(table).insert({
        title: props.title,
        description: props.description,
      });
      bookID = result[0];
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        console.log(e);
        throw new DuplicateEntryError("book");
      }
    }

    const records = await db<IBook>(table)
      .select("*")
      .where("id", bookID)
      .limit(1);
    return records[0];
  }

  // Update single book record and return the updated record.
  async updateBook(props: UpdateBookProps): Promise<IBook> {
    const { db, table } = this;

    await db(table)
      .update({
        title: props.title,
        description: props.description,
      })
      .where("id", props.id);

    const records = await db<IBook>(table)
      .select("*")
      .where("id", props.id)
      .limit(1);
    return records[0];
  }

  // Retrieve multiple book records within a given range specified by `skip` and `take`.
  async getBooks({ skip = 0, take = 10 }: GetBooksProps): Promise<IBook[]> {
    const { db, table } = this;

    return await db<IBook>(table).select("*").offset(skip).limit(take);
  }

  // Retrieve single book record by ID.
  async getBookByID(id: number): Promise<IBook> {
    const { db, table } = this;
    const records = await db<IBook>(table).select("*").where("id", id).limit(1);
    return records[0];
  }
}
