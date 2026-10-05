export type RoomSize = 'Small' | 'Medium' | 'Large';

export interface ClassScheduleItem {
  date: string;     // Định dạng: YYYY-MM-DD
  timeSlot: string; // Khung giờ: '07:30 - 08:30'
  className: string;// Tên lớp / môn: '21IT1 - Mạng máy tính'
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  size: RoomSize;
  image: string;
  description?: string;
  classSchedules?: ClassScheduleItem[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  timeSlot: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export type RootStackParamList = {
  MainTabs: { screen?: keyof TabParamList } | undefined;
  RoomDetails: { room: Room };
  BookingConfirmation: { bookingId: string };
};

export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};