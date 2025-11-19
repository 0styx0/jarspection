import { configDefaults, defineConfig } from "vitest/config";

export default {
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "e2e-tests/"],
    isolate: true,
  },
};
