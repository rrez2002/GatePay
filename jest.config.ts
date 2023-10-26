import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  coverageProvider: "v8",
  transform: {
    "^./test/+\\.test.ts?$": "ts-jest",
  },
  setupFiles: ["dotenv/config"],
};
export default config;
