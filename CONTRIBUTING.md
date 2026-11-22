# Contributing

The CLI lives in `src/` and the files it copies live in `templates/`.

```bash
vp install
vp check
vp test
vp run test:templates   # generate a Hono project in a temp dir, then vp install + vp check it
```

## Releasing

```bash
vp run release                  # bump the version, commit and tag
git push --follow-tags
vp pm publish --access public
```

Publish from an interactive terminal. npm asks for 2FA in the browser, and plain `npm` refuses to run inside this repo because `devEngines` pins pnpm.
