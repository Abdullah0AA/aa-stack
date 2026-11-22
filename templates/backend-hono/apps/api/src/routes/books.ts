import { validator } from "hono/validator";
import { z } from "zod";
import factory from "../factory";
import { createBook, getBook, listBooks } from "../services/books";

const bookInput = z.object({ title: z.string().trim().min(1) });
const bookId = z.uuid();

const router = factory
  .createApp()
  .get("/", async (c) => c.json(await listBooks()))
  .post(
    "/",
    validator("json", (value, c) => {
      const result = bookInput.safeParse(value);
      if (!result.success) return c.json({ error: "A book title is required." }, 400);
      return result.data;
    }),
    async (c) => c.json(await createBook(c.req.valid("json").title), 201),
  )
  .get("/:id", async (c) => {
    const id = bookId.safeParse(c.req.param("id"));
    if (!id.success) return c.json({ error: "Invalid book ID." }, 400);

    const book = await getBook(id.data);
    if (!book) return c.json({ error: "Book not found." }, 404);
    return c.json(book);
  });

export default router;
