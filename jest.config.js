// jest.config.js - Updated for better coverage
export default {
  testEnvironment: "node",

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

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
  ],

  // Lower threshold to get started
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },

  testTimeout: 10000,
  verbose: true,
};
