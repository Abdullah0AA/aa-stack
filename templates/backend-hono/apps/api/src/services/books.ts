import { eq } from "drizzle-orm";
import { db } from "../db";
import { books } from "../db/schema";

export function listBooks() {
  return db.select().from(books).orderBy(books.title, books.id);
}

export async function getBook(id: string) {
  const [book] = await db.select().from(books).where(eq(books.id, id));
  return book;
}

export async function createBook(title: string) {
  const [book] = await db.insert(books).values({ title }).returning();
  if (!book) throw new Error("The insert did not return a book.");
  return book;
}
