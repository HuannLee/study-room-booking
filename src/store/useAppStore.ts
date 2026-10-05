import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, RoomSize } from '../types/room';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FilterState {
  search: string;
  size: 'All' | RoomSize;
  building: string;
}

interface AppState {
  currentUser: User | null;
  filters: FilterState;
  bookings: Booking[];
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  setSearch: (search: string) => void;
  setSizeFilter: (size: 'All' | RoomSize) => void;
  setBuildingFilter: (building: string) => void;
  resetFilters: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      filters: {
        search: '',
        size: 'All',
        building: 'All',
      },
      bookings: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
      setSizeFilter: (size) => set((state) => ({ filters: { ...state.filters, size } })),
      setBuildingFilter: (building) => set((state) => ({ filters: { ...state.filters, building } })),
      resetFilters: () => set({ filters: { search: '', size: 'All', building: 'All' } }),
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
      cancelBooking: (bookingId) =>
        set((state) => ({ bookings: state.bookings.filter((b) => b.id !== bookingId) })),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ currentUser: state.currentUser, bookings: state.bookings }),
      
    },
    
  )
);