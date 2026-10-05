export type RoomStatus = 'Available' | 'Occupied';
export type RoomSize = 'Small' | 'Medium' | 'Large';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  size: RoomSize;
  status: RoomStatus;
  image: string;
  description?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  timeSlot: string;
  userId: string;
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