module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: false },
          target: "es2022",
        },
        module: { type: "commonjs" },
      },
    ],
  },
  setupFiles: ["reflect-metadata"],
  clearMocks: true,
};
