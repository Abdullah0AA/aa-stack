# backend-go (not built yet)

Placeholder for the Go backend overlay. The CLI lists Go but refuses to generate it until this layer exists.

Still needed:

- `apps/api` Go module (`go.mod`, `main.go`) serving `/api/*` on port 3000 to match the web dev proxy.
- `apps/api/package.json` shim so `vp run api#dev` runs `go run .` (and `dev:api` / `dev:full` root scripts via a partial root `package.json`).
- A typed client for the web app, since Hono RPC types don't exist here: e.g. OpenAPI spec from Go + `openapi-typescript` / `openapi-fetch`, overlaid as `apps/web/src/lib/api.ts` and `App.tsx`.
- Go formatting, linting and tests (`gofmt`, `go vet`); `vp check` doesn't cover Go.
