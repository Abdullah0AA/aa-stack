#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import * as p from "@clack/prompts";
import { runTemplate } from "bingo";
import { validateProjectName } from "./merge.ts";
import { backends, template } from "./template.ts";

const usage = `Usage: create [project-name] [--backend <${Object.keys(backends).join("|")}>] [--git | --no-git]`;

function fail(message: string): never {
  p.cancel(message);
  process.exit(1);
}

function orCancel<T extends string | boolean>(value: T | symbol): T {
  if (typeof value === "symbol") fail("Cancelled.");
  return value;
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    backend: { type: "string" },
    git: { type: "boolean" },
    help: { type: "boolean", short: "h" },
    // Vite+ can append this for Bingo generators. aa-stack always runs Bingo offline.
    "skip-requests": { type: "boolean" },
  },
});

if (values.help) {
  console.log(usage);
  process.exit(0);
}

p.intro("aa-stack");

const name =
  positionals[0] ??
  orCancel(
    await p.text({
      message: "Project name",
      placeholder: "my-app",
      validate: validateProjectName,
    }),
  );
const project = template.options.name.safeParse(name);
if (!project.success) fail(project.error.issues[0].message);

const selection =
  values.backend ??
  orCancel<string>(
    await p.select({
      message: "Backend",
      options: Object.entries(backends).map(([value, { label, hint, ready }]) => ({
        value,
        label,
        hint,
        disabled: !ready,
      })),
    }),
  );
const selectedBackend = template.options.backend.safeParse(selection);
if (!selectedBackend.success) fail(selectedBackend.error.issues[0].message);
const backend = selectedBackend.data;

const git = values.git ?? orCancel(await p.confirm({ message: "Initialize a git repository?" }));

const targetDir = resolve(project.data);
if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
  fail(`${targetDir} already exists and is not empty.`);
}

const projectName = basename(targetDir);
const creation = await runTemplate(template, {
  directory: targetDir,
  mode: "setup",
  offline: true,
  options: { backend, name: projectName },
});

if (git) {
  try {
    execFileSync("git", ["init", "--quiet"], { cwd: targetDir, stdio: "ignore" });
  } catch {
    p.log.warn("git init failed; skipping. Run it yourself later.");
  }
}

p.note(
  [`cd ${relative(process.cwd(), targetDir) || "."}`, ...(creation.suggestions ?? [])].join("\n"),
  "Next steps",
);
p.outro(`Created ${projectName} with the ${backends[backend].label} backend.`);
