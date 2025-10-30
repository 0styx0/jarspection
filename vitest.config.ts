export default {
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    isolate: true,
  },
};
