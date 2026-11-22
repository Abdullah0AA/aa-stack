import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    platform: "node",
    format: "esm",
  },
  staged: {
    "*": "vp check --no-error-on-unmatched-pattern",
  },
  // Templates are checked by generating a project (`vp run test:templates`), not in place.
  fmt: { ignorePatterns: ["templates/**"] },
  lint: {
    ignorePatterns: ["templates/**"],
    plugins: ["eslint", "typescript", "unicorn", "oxc"],
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn",
    },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
