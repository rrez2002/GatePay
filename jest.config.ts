import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "test/.*.test.ts$",
  setupFiles: ["dotenv/config"],
};
export default config;
