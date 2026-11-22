// Generates the Hono variant into a temp dir and runs vp install + vp check there.
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const projectDir = join(mkdtempSync(join(tmpdir(), "aa-create-")), "hono-app");
const run = (cmd: string, args: string[], cwd?: string) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit" });

run("node", ["dist/index.mjs", projectDir, "--backend", "hono", "--git"]);
run("vp", ["install"], projectDir);
run("vp", ["check"], projectDir);
console.log(`\nOK: ${projectDir}`);
