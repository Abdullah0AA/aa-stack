# api

[Hono](https://hono.dev) on [Bun](https://bun.sh).

Start it from the workspace root. It uses a SQLite file, `local.db`.

```bash
vp run dev:api
```

To change the database, edit [the schema](src/db/schema.ts), run `vp run api#db:generate`, and restart.

Migrations run on start in development. Run `vp run api#db:migrate` before deploying.

## Configuration

Environment variables are validated at startup in `src/config.ts`. If one is invalid, the server prints which one and exits.

| Variable       | Default       |
| -------------- | ------------- |
| `DATABASE_URL` | `local.db`    |
| `HOST`         | `127.0.0.1`   |
| `PORT`         | `3000`        |
| `LOG_LEVEL`    | `info`        |
| `NODE_ENV`     | `development` |

Logs go through pino. Each request is logged with a request ID, and output is pretty-printed when `NODE_ENV` is `development`.

## Adding an endpoint

1. Create `src/routes/<name>.ts` with `factory.createApp()` and **chain** the handlers (`.get(...).post(...)`). Chaining is what keeps the route types.
2. Mount it in `src/app.ts`: `.route("/api/<name>", <name>)`.
3. Call it from the web app through the typed client in `apps/web/src/lib/api.ts`:

```ts
const booksQuery = queryOptions({
  queryKey: ["books"],
  queryFn: () => parseResponse(api.books.$get()),
});
```

There is no code generation. The web app imports the API's types from `api/rpc` (`src/rpc.ts`), so a changed route shows up as a type error in the web app straight away.
