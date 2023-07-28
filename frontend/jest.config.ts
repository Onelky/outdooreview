process.env = Object.assign(process.env, {
  NODE_ENV: "TEST",
});

// module.exports = {
//   preset: "ts-jest",
//   // testEnvironment: 'node',
//   // setupFiles: ['dotenv/config'],
//   coverageDirectory: "<rootDir>/coverage/",
//   // modulePathIgnorePatterns: ['__db__', 'utils']
// };

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./src",
});

const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
