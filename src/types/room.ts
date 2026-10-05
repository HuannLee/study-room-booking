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
  date: string; // Định dạng YYYY-MM-DD
  timeSlot: string; // Ví dụ: "09:00 - 10:00"
  userId: string;
  createdAt: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetail: { room: Room };
};