import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetEditableRows from '../../../components/veterinarian/VetEditableRows.jsx';
jest.mock('../../../components/veterinarian/VetSpecializationSelector.jsx', () => () => <div>selector</div>);

test('renders editable rows snapshot', () => {
  const vet = { id:1, firstName:'A', lastName:'B', email:'e', phoneNumber:'1', gender:'Male', specialization:'Surg' };
  const { asFragment } = render(<table><tbody><VetEditableRows vet={vet} onSave={()=>{}} onCancel={()=>{}} /></tbody></table>);
  expect(asFragment()).toMatchSnapshot();
});
