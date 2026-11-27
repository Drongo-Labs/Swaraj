import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolve: [/@swaraj/],
  },
  sourcemap: true,
  clean: true,
  noExternal: ["@swaraj/contracts"],
  external: ["zod"],
});
