import { create } from 'zustand';
import { Booking, RoomSize, RoomStatus } from '../types/room';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FilterState {
  search: string;
  status: 'All' | RoomStatus;
  size: 'All' | RoomSize;
  building: string;
}

interface AppState {
  currentUser: User;
  filters: FilterState;
  bookings: Booking[];
  setSearch: (search: string) => void;
  setStatusFilter: (status: 'All' | RoomStatus) => void;
  setSizeFilter: (size: 'All' | RoomSize) => void;
  setBuildingFilter: (building: string) => void;
  resetFilters: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: {
    id: 'user_vku_01',
    name: 'Huân Lê',
    email: 'huanlv.21it@vku.udn.vn',
    role: 'Sinh viên',
  },
  filters: {
    search: '',
    status: 'All',
    size: 'All',
    building: 'All',
  },
  bookings: [
    {
      id: 'b1',
      roomId: '1',
      roomName: 'Lab A1-101',
      building: 'A',
      date: '2026-10-05',
      timeSlot: '09:00 - 10:00',
      userId: 'user_vku_01',
      createdAt: new Date().toISOString(),
    },
  ],
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setStatusFilter: (status) => set((state) => ({ filters: { ...state.filters, status } })),
  setSizeFilter: (size) => set((state) => ({ filters: { ...state.filters, size } })),
  setBuildingFilter: (building) => set((state) => ({ filters: { ...state.filters, building } })),
  resetFilters: () =>
    set({
      filters: { search: '', status: 'All', size: 'All', building: 'All' },
    }),
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  cancelBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== bookingId),
    })),
}));