import { rooms } from '../data/rooms';
import { Room, Booking } from '../types/room';

// Giả lập danh sách booking trên toàn hệ thống (bao gồm cả user khác)
let serverBookings: Booking[] = [
  {
    id: 'b_other_1',
    roomId: '1',
    roomName: 'Lab A1-101',
    building: 'A',
    date: '2026-10-05',
    timeSlot: '13:00 - 14:00',
    userId: 'user_99',
    createdAt: new Date().toISOString(),
  },
];

export const fetchRoomsApi = async (): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
  return rooms;
};

export const createBookingApi = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Kiểm tra conflict phòng & giờ
  const isConflict = serverBookings.some(
    (b) =>
      b.roomId === bookingData.roomId &&
      b.date === bookingData.date &&
      b.timeSlot === bookingData.timeSlot
  );

  if (isConflict) {
    throw new Error('Khung giờ này vừa được người khác đặt trước!');
  }

  const newBooking: Booking = {
    ...bookingData,
    id: 'b_' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  serverBookings.push(newBooking);
  return newBooking;
};