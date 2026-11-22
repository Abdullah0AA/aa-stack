import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text().notNull(),
});
