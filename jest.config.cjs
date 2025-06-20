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
  collectCoverageFrom: [
    'src/components/{common,home,hooks,layout,modals,pet,patient,rating,review,utils}/**/*.{js,jsx}',
    '!src/components/modals/ImageUploaderModal.jsx',
    '!src/components/modals/ChangePasswordModal.jsx',
    '!src/components/modals/ImageUploaderService.jsx',
    '!src/components/pet/PetsTable.jsx',
    '!src/components/pet/PetService.js',
    '!src/components/pet/PetBreedSelector.jsx',
    '!src/components/pet/PetColorSelector.jsx',
    '!src/components/pet/PetTypeSelector.jsx',
    '!src/components/user/UserService.js',
    '!src/components/user/UserDashboard.jsx',
    '!src/components/veterinarian/Veterinarian.jsx',
    '!src/components/veterinarian/VeterinarianListing.jsx',
    '!src/components/veterinarian/VeterinarianSearch.jsx',
    '!src/components/veterinarian/VetEditableRows.jsx',
  ],
  coveragePathIgnorePatterns: [],
};