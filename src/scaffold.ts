import { intakeDirectory, type IntakeDirectory } from "bingo-fs";
import { isMergeable, mergeText, toTargetPath } from "./merge.ts";

function mergeLayer(base: IntakeDirectory, layer: IntakeDirectory) {
  for (const [sourceName, entry] of Object.entries(layer)) {
    if (!entry) continue;
    const name = toTargetPath(sourceName);
    const previous = base[name];
    if (!Array.isArray(entry)) {
      base[name] = mergeLayer(previous && !Array.isArray(previous) ? previous : {}, entry);
    } else if (Array.isArray(previous) && isMergeable(name)) {
      base[name] = [mergeText(name, previous[0], entry[0]), previous[1] ?? {}];
    } else {
      base[name] = entry;
    }
  }
  return base;
}

export async function readTemplateFiles(layerDirs: string[]) {
  const layers = await Promise.all(layerDirs.map((directory) => intakeDirectory(directory)));
  return layers.reduce(mergeLayer, {});
}
