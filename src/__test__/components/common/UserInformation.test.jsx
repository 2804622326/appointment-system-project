import React from 'react';
import { render, screen } from '@testing-library/react';
import UserInformation from '../../../components/common/UserInformation';

describe('UserInformation Component', () => {
  const mockPatientAppointment = {
    appointmentNo: 'APP123',
    patient: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phoneNumber: '123-456-7890'
    }
  };

  const mockVetAppointment = {
    appointmentNo: 'APP456',
    veterinarian: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@vetclinic.com',
      phoneNumber: '098-765-4321',
      specialization: 'Surgery'
    }
  };

  test('renders patient information when userType is VET', () => {
    render(<UserInformation userType="VET" appointment={mockPatientAppointment} />);
    
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Appointment No: APP123')).toBeInTheDocument();
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@email.com')).toBeInTheDocument();
    expect(screen.getByText('Phone Number: 123-456-7890')).toBeInTheDocument();
  });

  test('renders veterinarian information when userType is not VET', () => {
    render(<UserInformation userType="PATIENT" appointment={mockVetAppointment} />);
    
    expect(screen.getByText('Veterinarian Information')).toBeInTheDocument();
    expect(screen.getByText('Appointment No: APP456')).toBeInTheDocument();
    expect(screen.getByText('Name: Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Specialization: Surgery')).toBeInTheDocument();
    expect(screen.getByText('Email: jane.smith@vetclinic.com')).toBeInTheDocument();
    expect(screen.getByText('Phone Number: 098-765-4321')).toBeInTheDocument();
  });

  test('applies correct styling and classes', () => {
    const { container } = render(<UserInformation userType="VET" appointment={mockPatientAppointment} />);
    
    const divElement = container.firstChild;
    expect(divElement).toHaveClass('mt-2', 'mb-2');
    expect(divElement).toHaveStyle({ backgroundColor: 'whiteSmoke' });
  });

  test('renders correct CSS classes for info elements', () => {
    render(<UserInformation userType="VET" appointment={mockPatientAppointment} />);
    
    const appointmentNoElement = screen.getByText('Appointment No: APP123');
    const phoneNumberElement = screen.getByText('Phone Number: 123-456-7890');
    
    expect(appointmentNoElement).toHaveClass('text-info');
    expect(phoneNumberElement).toHaveClass('text-info');
  });

  test('renders correct CSS classes for vet info elements', () => {
    render(<UserInformation userType="PATIENT" appointment={mockVetAppointment} />);
    
    const appointmentNoElement = screen.getByText('Appointment No: APP456');
    const specializationElement = screen.getByText('Specialization: Surgery');
    const phoneNumberElement = screen.getByText('Phone Number: 098-765-4321');
    
    expect(appointmentNoElement).toHaveClass('text-info');
    expect(specializationElement).toHaveClass('text-info');
    expect(phoneNumberElement).toHaveClass('text-info');
  });
});