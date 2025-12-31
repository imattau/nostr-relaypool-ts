/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testMatch: ["**/*test.[jt]s"],
  expand: true,
  silent: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 5000,
  moduleNameMapper: {
    "^nostr-tools/lib/esm/nip57$": "<rootDir>/node_modules/nostr-tools/lib/esm/nip57.js",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(nostr-tools)/)", // Transform nostr-tools ESM modules
  ],
};

module.exports = config;
// export default config
