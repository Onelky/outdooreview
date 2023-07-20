process.env = Object.assign(process.env, {
    NODE_ENV: 'TEST'
})

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    coverageDirectory: '<rootDir>/coverage/',
    modulePathIgnorePatterns: ['__db__', 'constants']
}
