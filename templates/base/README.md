# Web + API monorepo

A React web app and an API in one Vite+ monorepo (pnpm workspaces and catalogs).

## Getting started

Requires Node.js 26 or later.

```bash
vp install
```

Then run `vp run dev:full`.

This starts the web app (Vite prints its URL) and the API on `http://127.0.0.1:3000`. The web dev server proxies `/api/*` to the API, so the browser only talks to one origin. Backend setup and how to add endpoints are in [apps/api/README.md](apps/api/README.md).

## Layout

| Path                  | What                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| `apps/web`            | React 19, TanStack Router and Query, Tailwind CSS v4, shadcn/ui                        |
| `apps/api`            | The backend                                                                            |
| `packages/`, `tools/` | Not created. Any folder you add here with a `package.json` becomes a workspace package |

In the web app, routes are files in `apps/web/src/routes`. `routeTree.gen.ts` is generated from them, so don't edit it by hand.

## Commands

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `vp run dev:full` | Web app and API together                             |
| `vp run dev`      | Web app only                                         |
| `vp run dev:api`  | API only                                             |
| `vp check`        | Format, lint and type check                          |
| `vp test`         | Run tests                                            |
| `vp run ready`    | `vp check`, then build every app. Run before pushing |

A pre-commit hook runs `vp check` on staged files.

## Dependencies

Versions live in one place: the `catalog` in `pnpm-workspace.yaml`. Each `package.json` refers to them as `"catalog:"`, so every app uses the same version.

```bash
vp add zod --filter web        # adds zod to the catalog and to apps/web
vp add -D vitest --filter api  # dev dependency for apps/api
```

To bump a version, change it in the catalog and run `vp install`. `pnpm outdated -r` lists what's behind.

## UI components

shadcn/ui components are added into `apps/web/src/components/ui`:

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog
```

## Editors and agents

`.vscode` and `.zed` set Oxc as the formatter and linter. `AGENTS.md` tells coding agents how to work with Vite+ in this repo.
