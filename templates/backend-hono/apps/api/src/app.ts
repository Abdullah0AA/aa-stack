import factory from "./factory";
import { requestLogger } from "./middleware/logging";
import health from "./routes/health";
import authors from "./routes/authors";
import books from "./routes/books";

const app = factory
  .createApp()
  .use(requestLogger)
  .route("/api/health", health)
  .route("/api/authors", authors)
  .route("/api/books", books);

export default app;
