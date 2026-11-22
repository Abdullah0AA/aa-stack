import { describe, expect, it } from "vite-plus/test";
import { deepMerge, mergeText, toTargetPath, validateProjectName } from "./merge.ts";

describe("toTargetPath", () => {
  it("renames underscore dotfiles at any depth", () => {
    expect(toTargetPath("_gitignore")).toBe(".gitignore");
    expect(toTargetPath("apps/api/_gitignore")).toBe("apps/api/.gitignore");
    expect(toTargetPath("apps/_npmrc/x.ts")).toBe("apps/.npmrc/x.ts");
    expect(toTargetPath("src/_gitignore.ts")).toBe("src/_gitignore.ts");
  });
});

describe("deepMerge", () => {
  it("merges nested objects and lets the overlay win otherwise", () => {
    expect(deepMerge({ a: { b: 1, c: [1] }, d: 1 }, { a: { c: [2], e: 3 } })).toEqual({
      a: { b: 1, c: [2], e: 3 },
      d: 1,
    });
  });
});

describe("mergeText", () => {
  it("merges package.json and keeps dependencies sorted", () => {
    const base = JSON.stringify({ name: "web", dependencies: { react: "1", cn: "1" } });
    const overlay = JSON.stringify({ dependencies: { api: "workspace:*" } });
    expect(JSON.parse(mergeText("apps/web/package.json", base, overlay))).toEqual({
      name: "web",
      dependencies: { api: "workspace:*", cn: "1", react: "1" },
    });
    expect(Object.keys(JSON.parse(mergeText("package.json", base, overlay)).dependencies)).toEqual([
      "api",
      "cn",
      "react",
    ]);
  });

  it("keeps yaml formatting and comments", () => {
    const base = "# root\npackages:\n  - apps/*\n\ncatalog:\n  react: ^19\n\noverrides:\n  a: b\n";
    expect(mergeText("pnpm-workspace.yaml", base, "catalog:\n  hono: ^5\n")).toBe(
      "# root\npackages:\n  - apps/*\n\ncatalog:\n  react: ^19\n  hono: ^5\n\noverrides:\n  a: b\n",
    );
  });

  it("merges yaml catalogs", () => {
    const merged = mergeText(
      "pnpm-workspace.yaml",
      "packages:\n  - apps/*\ncatalog:\n  react: ^19\n",
      "catalog:\n  hono: ^5\n",
    );
    expect(merged).toBe("packages:\n  - apps/*\ncatalog:\n  react: ^19\n  hono: ^5\n");
  });
});

describe("validateProjectName", () => {
  it("accepts npm-safe names, including nested paths", () => {
    expect(validateProjectName("my-app")).toBeUndefined();
    expect(validateProjectName("../apps/my-app")).toBeUndefined();
  });

  it("rejects empty and invalid names", () => {
    expect(validateProjectName("")).toBeDefined();
    expect(validateProjectName("My App")).toBeDefined();
  });
});
