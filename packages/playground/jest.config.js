module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+.(ts|tsx|js|jsx)$': 'ts-jest',
    '^.+\\.svg$': '<rootDir>/jest/svgTransform.ts',
  },
  setupFiles: ['<rootDir>/jest/setEnvVars.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['^react-monaco-editor', '^monaco-editor'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    '^.+.(css|scss)$': 'identity-obj-proxy',
    '^monaco-editor/(.*)': '<rootDir>/../../node_modules/monaco-editor/$1',
    'monaco-editor/': '<rootDir>/../../node_modules/monaco-editor',
    '@paritytech/components/(.*)': '<rootDir>/../components/src/$1',
    '^@paritytech/components/': '<rootDir>/../components/src',
    '@paritytech/ink-editor/(.*)': '<rootDir>/../ink-editor/src/$1',
    '^@paritytech/ink-editor/': '<rootDir>/../ink-editor/src',
  },
};
