import { schema as booksSchema } from "./books";
import { schema as categoriesSchema } from "./categories";
import { schema as authorsSchema } from "./authors";

export default `
${categoriesSchema}
${booksSchema}
${authorsSchema}
`;
