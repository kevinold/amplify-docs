module.exports = {
  roots: ['<rootDir>/src'],
  projects: [
    // Projects which require special configuration.

    'tasks/jest.config.js',

    // Everything else.
    //
    // Note the trickiness here: the next project is "recursive";
    // when Jest looks at it, it will use the `testMatch` (etc)
    // below and ignore the `tasks` listing.

    'jest.config.js'
  ],
  testPathIgnorePatterns: [
    // Any project which had special configuration above should be
    // ignored here.

    '<rootDir>/tasks',

    // Misc dirs

    'capi',
    '.next',
    'client',

    // Standard ignores.

    '/node_modules/'
  ],
  transform: {
    '^.+\\.(ts|tsx|js)$': [
      'babel-jest',
      {
        presets: ['next/babel']
      }
    ]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
