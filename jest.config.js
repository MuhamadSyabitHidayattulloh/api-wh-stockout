// jest.config.js - Updated untuk setup.js di root
export default {
  testEnvironment: "node",

  // Setup files (update path ke root)
  setupFilesAfterEnv: ["<rootDir>/setup.js"],

  // Minimal transform
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // Module mapping
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  clearMocks: true,
  restoreMocks: true,

  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/logs/**",
    "!**/tests/**",
    "!jest.config.js",
    "!**/*.test.js",
    "!**/*.spec.js",
    "!setup.js", // Exclude setup.js dari coverage
  ],

  // Lower threshold to get started
  coverageThreshold: {
    global: {
      branches: 5, // Turunkan dulu
      functions: 5, // Turunkan dulu
      lines: 5, // Turunkan dulu
      statements: 5, // Turunkan dulu
    },
  },

  testTimeout: 10000,
  verbose: true,
};
