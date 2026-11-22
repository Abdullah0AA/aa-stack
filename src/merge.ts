import { basename, extname, join } from "node:path";
import { parse, parseDocument } from "yaml";

const DOTFILES: Record<string, string> = { _gitignore: ".gitignore", _npmrc: ".npmrc" };
const DEPENDENCY_KEYS = ["dependencies", "devDependencies", "peerDependencies"];

export const isMergeable = (path: string) => [".json", ".yaml", ".yml"].includes(extname(path));

export function toTargetPath(relativePath: string) {
  return relativePath
    .split(/[\\/]/)
    .map((segment) => DOTFILES[segment] ?? segment)
    .join("/");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge(base: unknown, overlay: unknown): unknown {
  if (!isObject(base) || !isObject(overlay)) return overlay;
  const merged = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    merged[key] = deepMerge(base[key], value);
  }
  return merged;
}

function sortDependencies(pkg: Record<string, unknown>) {
  const sorted = { ...pkg };
  for (const key of DEPENDENCY_KEYS) {
    const deps = pkg[key];
    if (isObject(deps)) {
      sorted[key] = Object.fromEntries(
        Object.entries(deps).toSorted(([a], [b]) => a.localeCompare(b)),
      );
    }
  }
  return sorted;
}

function* leaves(value: unknown, path: string[] = []): Generator<[string[], unknown]> {
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) yield* leaves(child, [...path, key]);
  } else {
    yield [path, value];
  }
}

// Edits the base document in place so its comments and blank lines survive.
function mergeYaml(base: string, overlay: string) {
  const doc = parseDocument(base);
  for (const [path, value] of leaves(parse(overlay))) doc.setIn(path, value);
  return doc.toString();
}

/** Merges an overlay file's text into the base file's text. `path` picks the format. */
export function mergeText(path: string, base: string, overlay: string) {
  if (extname(path) !== ".json") return mergeYaml(base, overlay);
  const merged: unknown = deepMerge(JSON.parse(base), JSON.parse(overlay));
  const output =
    basename(path) === "package.json" && isObject(merged) ? sortDependencies(merged) : merged;
  return `${JSON.stringify(output, null, 2)}\n`;
}

export function withPackageName(packageJson: string, name: string) {
  const pkg: unknown = JSON.parse(packageJson);
  return `${JSON.stringify({ ...(isObject(pkg) ? pkg : {}), name }, null, 2)}\n`;
}

export function validateProjectName(name: string | undefined) {
  if (!name) return "Project name is required.";
  const packageName = basename(join(name));
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(packageName)) {
    return "Use lowercase letters, digits, '-', '_' or '.' (it becomes the package name).";
  }
  return undefined;
}
