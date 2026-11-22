import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig } from "vite-plus";

const queryRecommendedRules = Object.assign(
  {},
  ...pluginQuery.configs["flat/recommended-strict"].map((config) => config.rules ?? {}),
);

export default defineConfig({
  staged: {
    "*": "vp check --no-error-on-unmatched-pattern",
  },
  fmt: { ignorePatterns: ["**/routeTree.gen.ts", "apps/api/drizzle/**"] },
  lint: {
    ignorePatterns: ["**/routeTree.gen.ts"],
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "@tanstack/query", specifier: "@tanstack/eslint-plugin-query" },
    ],
    plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn",
    },
    rules: {
      ...queryRecommendedRules,
      "react/hooks": "off",
      "react/rules-of-hooks": "error",
      "react/unsupported-syntax": "warn",
      "react/react-in-jsx-scope": "off",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          customHOCs: ["createFileRoute", "createRootRoute", "createRootRouteWithContext"],
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    overrides: [
      {
        files: ["apps/web/src/components/ui/**/*.{ts,tsx}"],
        rules: {
          "react/only-export-components": "off",
        },
      },
    ],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
