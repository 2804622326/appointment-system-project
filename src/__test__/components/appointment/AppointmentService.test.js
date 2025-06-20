import {
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  approveAppointment,
  declineAppointment,
  getAppointmentById,
  countAppointments,
  getAppointmentsSummary,
} from '../../../components/appointment/AppointmentService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({ data: 'posted' })),
    put: jest.fn(() => Promise.resolve({ data: 'updated' })),
    get: jest.fn(() => Promise.resolve({ data: 'fetched' })),
  },
}));

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('bookAppointment posts data with auth header', async () => {
    localStorage.setItem('authToken', 'token123');
    await bookAppointment('1', '2', { a: 1 });
    expect(api.post).toHaveBeenCalledWith(
      '/appointments/book-appointment?senderId=1&recipientId=2',
      { a: 1 },
      { headers: { Authorization: 'Bearer token123' } }
    );
  });

  test('updateAppointment uses put', async () => {
    await updateAppointment(3, { foo: 'bar' });
    expect(api.put).toHaveBeenCalledWith('appointments/appointment/3/update', { foo: 'bar' });
  });

  test('cancelAppointment uses put', async () => {
    await cancelAppointment(4);
    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/4/cancel');
  });

  test('approveAppointment uses put', async () => {
    await approveAppointment(5);
    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/5/approve');
  });

  test('declineAppointment uses put', async () => {
    await declineAppointment(6);
    expect(api.put).toHaveBeenCalledWith('/appointments/appointment/6/decline');
  });

  test('getAppointmentById fetches data', async () => {
    await getAppointmentById(7);
    expect(api.get).toHaveBeenCalledWith('/appointments/appointment/7/fetch/appointment');
  });

  test('countAppointments fetches count', async () => {
    await countAppointments();
    expect(api.get).toHaveBeenCalledWith('/appointments/count/appointments');
  });

  test('getAppointmentsSummary fetches summary', async () => {
    await getAppointmentsSummary();
    expect(api.get).toHaveBeenCalledWith('/appointments/summary/appointments-summary');
  });
});
