module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  transformIgnorePatterns: []
  //transformIgnorePatterns: ['<rootDir>/node_modules/']
  // transformIgnorePatterns: [
  //   '<rootDir>/node_modules/(?!(unist-util-visit|unist-util-visit-parents))'
  // ]
};
