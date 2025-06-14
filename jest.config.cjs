module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__test__/**/*.test.js', '**/__test__/**/*.test.jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};