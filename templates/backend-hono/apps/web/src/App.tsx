import { Button } from "@/components/ui/button";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";
import { parseResponse } from "hono/client";

const booksQuery = queryOptions({
  queryKey: ["books"],
  queryFn: () => parseResponse(api.books.$get()),
});

export function App() {
  const books = useQuery(booksQuery);
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <section>
          <h2 className="font-medium">Books</h2>
          {books.isPending && <p>Loading books…</p>}
          {books.isError && <p>Couldn’t load books.</p>}
          {books.data?.length === 0 && <p>No books yet.</p>}
          {!!books.data?.length && (
            <ul className="list-disc pl-5">
              {books.data.map((book) => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
          )}
        </section>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}

export default App;
