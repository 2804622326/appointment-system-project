
import { api } from '../../../components/utils/api';
import { 
bookAppointment, 
updateAppointment, 
cancelAppointment, 
approveAppointment, 
declineAppointment, 
getAppointmentById, 
countAppointments, 
getAppointmentsSummary 
} from '../../../components/appointment/AppointmentService';

// Mock the api module
jest.mock('../../../components/utils/api');

// Mock localStorage
const mockLocalStorage = {
getItem: jest.fn(),
setItem: jest.fn(),
removeItem: jest.fn(),
clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mock console.log to avoid noise in tests
global.console = {
...console,
log: jest.fn(),
};

describe('AppointmentService', () => {
beforeEach(() => {
  jest.clearAllMocks();
});

describe('bookAppointment', () => {
  it('should book appointment successfully', async () => {
    const mockToken = 'mock-token';
    const mockResponseData = { id: 1, status: 'pending' };
    const mockResponse = { data: mockResponseData };
    
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    api.post.mockResolvedValue(mockResponse);

    const result = await bookAppointment(1, 2, { date: '2023-12-01', time: '10:00' });

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    expect(api.post).toHaveBeenCalledWith(
      '/appointments/book-appointment?senderId=1&recipientId=2',
      { date: '2023-12-01', time: '10:00' },
      {
        headers: {
          Authorization: 'Bearer mock-token',
        },
      }
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when booking appointment fails', async () => {
    const mockError = new Error('Network error');
    mockLocalStorage.getItem.mockReturnValue('token');
    api.post.mockRejectedValue(mockError);

    await expect(bookAppointment(1, 2, {})).rejects.toThrow('Network error');
  });
});

describe('updateAppointment', () => {
  it('should update appointment successfully', async () => {
    const mockResponse = { data: { message: 'Updated successfully' } };
    api.put.mockResolvedValue(mockResponse);

    const result = await updateAppointment(1, { status: 'confirmed' });

    expect(api.put).toHaveBeenCalledWith(
      'appointments/appointment/1/update',
      { status: 'confirmed' }
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when update fails', async () => {
    const mockError = new Error('Update failed');
    api.put.mockRejectedValue(mockError);

    await expect(updateAppointment(1, {})).rejects.toThrow('Update failed');
  });
});

describe('cancelAppointment', () => {
  it('should cancel appointment successfully', async () => {
    const mockResponseData = { message: 'Appointment cancelled' };
    const mockResponse = { data: mockResponseData };
    api.put.mockResolvedValue(mockResponse);

    const result = await cancelAppointment(1);

    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/1/cancel');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when cancellation fails', async () => {
    const mockError = new Error('Cancellation failed');
    api.put.mockRejectedValue(mockError);

    await expect(cancelAppointment(1)).rejects.toThrow('Cancellation failed');
  });
});

describe('approveAppointment', () => {
  it('should approve appointment successfully', async () => {
    const mockResponseData = { message: 'Appointment approved' };
    const mockResponse = { data: mockResponseData };
    api.put.mockResolvedValue(mockResponse);

    const result = await approveAppointment(1);

    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/1/approve');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when approval fails', async () => {
    const mockError = new Error('Approval failed');
    api.put.mockRejectedValue(mockError);

    await expect(approveAppointment(1)).rejects.toThrow('Approval failed');
  });
});

describe('declineAppointment', () => {
  it('should decline appointment successfully', async () => {
    const mockResponseData = { message: 'Appointment declined' };
    const mockResponse = { data: mockResponseData };
    api.put.mockResolvedValue(mockResponse);

    const result = await declineAppointment(1);

    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/1/decline');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when decline fails', async () => {
    const mockError = new Error('Decline failed');
    api.put.mockRejectedValue(mockError);

    await expect(declineAppointment(1)).rejects.toThrow('Decline failed');
  });
});

describe('getAppointmentById', () => {
  it('should get appointment by id successfully', async () => {
    const mockResponseData = { id: 1, date: '2023-12-01' };
    const mockResponse = { data: mockResponseData };
    api.get.mockResolvedValue(mockResponse);

    const result = await getAppointmentById(1);

    expect(api.get).toHaveBeenCalledWith('/appointments/appointment/1/fetch/appointment');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when getting appointment fails', async () => {
    const mockError = new Error('Appointment not found');
    api.get.mockRejectedValue(mockError);

    await expect(getAppointmentById(1)).rejects.toThrow('Appointment not found');
  });
});

describe('countAppointments', () => {
  it('should count appointments successfully', async () => {
    const mockResponseData = { count: 5 };
    const mockResponse = { data: mockResponseData };
    api.get.mockResolvedValue(mockResponse);

    const result = await countAppointments();

    expect(api.get).toHaveBeenCalledWith('/appointments/count/appointments');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when counting fails', async () => {
    const mockError = new Error('Count failed');
    api.get.mockRejectedValue(mockError);

    await expect(countAppointments()).rejects.toThrow('Count failed');
  });
});

describe('getAppointmentsSummary', () => {
  it('should get appointments summary successfully', async () => {
    const mockResponseData = { 
      total: 10, 
      pending: 3, 
      approved: 5, 
      cancelled: 2 
    };
    const mockResponse = { data: mockResponseData };
    api.get.mockResolvedValue(mockResponse);

    const result = await getAppointmentsSummary();

    expect(api.get).toHaveBeenCalledWith('/appointments/summary/appointments-summary');
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error when getting summary fails', async () => {
    const mockError = new Error('Summary failed');
    api.get.mockRejectedValue(mockError);

    await expect(getAppointmentsSummary()).rejects.toThrow('Summary failed');
  });
});
});