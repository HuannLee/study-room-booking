import { Booking } from '../types/room';

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    roomId: '1',
    roomName: 'Lab A1-101',
    building: 'A',
    date: '2026-10-05',
    timeSlot: '09:00 - 10:00',
    userId: 'user_02',
    createdAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'b2',
    roomId: '1',
    roomName: 'Lab A1-101',
    building: 'A',
    date: '2026-10-05',
    timeSlot: '13:00 - 14:00',
    userId: 'user_03',
    createdAt: '2026-10-04T11:00:00Z',
  },
];