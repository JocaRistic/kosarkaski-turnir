import { readFileSync } from "fs";

function loadData(filePath) {
  const data = readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export function loadGroups() {
  return loadData("src/data/groups.json");
}

export function loadExibitionMatches() {
  return loadData("src/data/exibitions.json");
}
