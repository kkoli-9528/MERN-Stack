import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: "ts-jest/presets/default-esm",
  globalSetup: "<rootDir>/src/test/globalSetup.ts",
  globalTeardown: "<rootDir>/src/test/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/src/test/setupFile.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.tsx?$": ["ts-jest", { useEMS: true }],
  },
  maxWorkers: "4",
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["js", "ts", "json"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.ts$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s", "**/?(*.)+(test).[tj]s"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "seed.ts",
    "setupFile.ts",
  ],
};
