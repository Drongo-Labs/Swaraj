import { writeFileSync } from "node:fs";
import { buildVectors } from "./build-vectors.mjs";

writeFileSync(new URL("../test/vectors.json", import.meta.url), JSON.stringify(await buildVectors(), null, 2) + "\n");
console.log("wrote test/vectors.json");
