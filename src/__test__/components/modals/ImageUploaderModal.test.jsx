import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUploaderModal from '../../../components/modals/ImageUploaderModal.jsx';

jest.mock('../../../components/hooks/UseMessageAlerts.js', () => () => ({
  successMessage: '',
  setSuccessMessage: jest.fn(),
  errorMessage: '',
  setErrorMessage: jest.fn(),
  showSuccessAlert: false,
  setShowSuccessAlert: jest.fn(),
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
}));

jest.mock('../../../components/user/UserService', () => ({
  getUserById: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock('../../../components/modals/ImageUploaderService.jsx', () => ({
  uploadUserPhoto: jest.fn().mockResolvedValue({ data: 'ok' }),
  updateUserPhoto: jest.fn(),
}));

test('uploads new image', async () => {
  const { uploadUserPhoto } = require('../../../components/modals/ImageUploaderService.jsx');
  const { asFragment } = render(<ImageUploaderModal userId={1} show handleClose={() => {}} />);
  const file = new File(['img'], 'img.png', { type: 'image/png' });
  fireEvent.change(document.querySelector("input[type='file']"), { target: { files: [file] } });
  fireEvent.click(screen.getByText('Upload'));
  await waitFor(() => expect(uploadUserPhoto).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
