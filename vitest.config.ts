import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.pact.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
