import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createTemplate } from "bingo";
import { z } from "zod";
import { validateProjectName, withPackageName } from "./merge.ts";
import { readTemplateFiles } from "./scaffold.ts";

const templatesDir = fileURLToPath(new URL("../templates", import.meta.url));

export const backends = {
  hono: { label: "Hono", hint: "Bun, RPC types shared with the web app", ready: true },
  go: { label: "Go", hint: "coming soon", ready: false },
} as const;

export const template = createTemplate({
  options: {
    name: z
      .string()
      .superRefine((name, context) => {
        const message = validateProjectName(name);
        if (message) context.addIssue({ code: "custom", message });
      })
      .describe("Project name"),
    backend: z
      .enum(["hono", "go"], { error: (issue) => `Unknown backend "${String(issue.input)}".` })
      .superRefine((backend, context) => {
        const { ready, label } = backends[backend];
        if (!ready)
          context.addIssue({
            code: "custom",
            message: `The ${label} backend isn't available yet.`,
          });
      })
      .describe("Backend"),
  },
  async produce({ options: { backend, name } }) {
    const files = await readTemplateFiles([
      join(templatesDir, "base"),
      join(templatesDir, `backend-${backend}`),
    ]);
    const manifest = files["package.json"];
    if (!Array.isArray(manifest)) throw new Error("Template package.json is missing.");
    return {
      files: { ...files, "package.json": withPackageName(manifest[0], name) },
      suggestions: ["vp install", "vp run dev:full"],
    };
  },
});
