process.env = Object.assign(process.env, {
  NODE_ENV: 'TEST'
})

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './src'
})

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/src/'],
  modulePaths: ['<rootDir>/src/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
