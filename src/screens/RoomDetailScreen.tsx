import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { RootStackParamList } from '../types/room';
import { useAppStore } from '../store/useAppStore';
import { createBookingApi } from '../api/roomsAPI';

type RoomDetailsRouteProp = RouteProp<RootStackParamList, 'RoomDetails'>;

const TIME_SLOTS = [
  '07:30 - 08:30',
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

function generateUpcomingSevenDays(): string[] {
  const days: string[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);

    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, '0');
    const day = String(nextDay.getDate()).padStart(2, '0');

    days.push(`${year}-${month}-${day}`);
  }
  return days;
}

export default function RoomDetailsScreen() {
  const route = useRoute<RoomDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { room } = route.params;

  const { currentUser, bookings, addBooking } = useAppStore();

  const upcomingDates = useMemo(() => generateUpcomingSevenDays(), []);
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const bookingMutation = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (newBooking) => {
      addBooking(newBooking);
      navigation.navigate('BookingConfirmation', { bookingId: newBooking.id });
    },
    onError: (error: any) => {
      Alert.alert('Đặt phòng thất bại', error?.message || 'Có lỗi xảy ra.');
    },
  });

  const isTimePassed = (timeSlotStr: string): boolean => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (selectedDate !== todayStr) return false;

    const [startPart] = timeSlotStr.split(' - ');
    const [slotHour, slotMinute] = startPart.split(':').map(Number);

    if (now.getHours() > slotHour) return true;
    if (now.getHours() === slotHour && now.getMinutes() >= slotMinute) return true;

    return false;
  };

  const getSlotDetails = (slot: string) => {
    const passed = isTimePassed(slot);

    // 1. Kiểm tra lịch học chính khóa
    const classSchedule = room.classSchedules?.find(
      (cs) => cs.date === selectedDate && cs.timeSlot === slot
    );

    // 2. Kiểm tra bản thân đã đặt phòng này chưa
    const myBookingHere = bookings.find(
      (b) =>
        b.roomId === room.id &&
        b.date === selectedDate &&
        b.timeSlot === slot &&
        b.userId === currentUser?.id 
    );

    // 3. Kiểm tra bản thân có lịch ở phòng khác cùng khung giờ này không
    const conflictingBooking = bookings.find(
      (b) =>
        b.roomId !== room.id &&
        b.date === selectedDate &&
        b.timeSlot === slot &&
        b.userId === currentUser?.id
    );

    // 4. Kiểm tra người khác đã đặt nguyên phòng này chưa
    const otherBookingHere = bookings.find(
      (b) =>
        b.roomId === room.id &&
        b.date === selectedDate &&
        b.timeSlot === slot &&
        b.userId !== currentUser?.id
    );

    const isOccupied = Boolean(classSchedule || otherBookingHere);
    const disabled = passed || Boolean(myBookingHere) || Boolean(conflictingBooking) || isOccupied;

    return {
      passed,
      classSchedule,
      myBookingHere,
      conflictingBooking,
      otherBookingHere,
      disabled,
    };
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert('Thông báo', 'Vui lòng chọn khung giờ.');
      return;
    }

    bookingMutation.mutate({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      date: selectedDate,
      timeSlot: selectedSlot,
      userId: currentUser?.id,
      userName: currentUser?.name,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: room.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>
          Tòa nhà {room.building} · Sức chứa: {room.capacity} người ({room.size})
        </Text>

        {/* 1. Chọn ngày */}
        <Text style={styles.sectionTitle}>1. Chọn ngày:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {upcomingDates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            const [, month, day] = dateStr.split('-');

            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.dateChip, isSelected && styles.dateChipActive]}
                onPress={() => {
                  setSelectedDate(dateStr);
                  setSelectedSlot(null);
                }}
              >
                <Text style={[styles.dateTextLabel, isSelected && styles.dateTextActive]}>
                  {day}/{month}
                </Text>
                <Text style={[styles.dateSubLabel, isSelected && styles.dateTextActive]}>
                  {dateStr === upcomingDates[0] ? 'Hôm nay' : `Ngày ${day}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 2. Chọn khung giờ */}
        <Text style={styles.sectionTitle}>2. Chọn khung giờ:</Text>
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => {
            const details = getSlotDetails(slot);
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                disabled={details.disabled || bookingMutation.isPending}
                style={[
                  styles.slotCard,
                  isSelected && styles.slotCardSelected,
                  details.disabled && styles.slotCardDisabled,
                  details.myBookingHere && styles.slotBookedByMe,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotTimeText,
                    isSelected && styles.slotTextSelected,
                    details.disabled && styles.slotTextMuted,
                  ]}
                >
                  {slot}
                </Text>

                {details.classSchedule ? (
                  <Text numberOfLines={1} style={styles.statusSchedule}>
                    📅 Lịch học: {details.classSchedule.className}
                  </Text>
                ) : details.myBookingHere ? (
                  <Text style={styles.statusBooked}>✓ Bạn đã đặt</Text>
                ) : details.conflictingBooking ? (
                  <Text numberOfLines={1} style={styles.statusConflict}>
                    ⚠ Trùng: {details.conflictingBooking.roomName}
                  </Text>
                ) : details.otherBookingHere ? (
                  <Text style={styles.statusOtherBooked}>✕ Đã được đặt</Text>
                ) : details.passed ? (
                  <Text style={styles.statusPassed}>Đã qua</Text>
                ) : (
                  <Text style={styles.statusAvailable}>Phòng trống</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nút gửi request đặt */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedSlot || bookingMutation.isPending) && styles.confirmButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={!selectedSlot || bookingMutation.isPending}
        >
          {bookingMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {selectedSlot ? `Đặt phòng: ${selectedSlot}` : 'Vui lòng chọn khung giờ'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  image: { width: '100%', height: 210 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#334155', marginBottom: 10 },

  dateScroll: { flexDirection: 'row', marginBottom: 20 },
  dateChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    minWidth: 78,
  },
  dateChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  dateTextLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  dateSubLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },
  dateTextActive: { color: '#fff' },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  slotCard: {
    width: '48.5%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotCardSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff', borderWidth: 2 },
  slotCardDisabled: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  slotBookedByMe: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },

  slotTimeText: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  slotTextSelected: { color: '#2563eb', fontWeight: '700' },
  slotTextMuted: { color: '#94a3b8' },

  statusBooked: { fontSize: 11, color: '#16a34a', fontWeight: '700', marginTop: 4 },
  statusSchedule: { fontSize: 10, color: '#d97706', fontWeight: '600', marginTop: 4 },
  statusConflict: { fontSize: 10, color: '#e11d48', fontWeight: '600', marginTop: 4 },
  statusOtherBooked: { fontSize: 11, color: '#ef4444', fontWeight: '600', marginTop: 4 },
  statusPassed: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 4 },
  statusAvailable: { fontSize: 11, color: '#0284c7', fontWeight: '500', marginTop: 4 },

  confirmButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginBottom: 30,
  },
  confirmButtonDisabled: { backgroundColor: '#94a3b8', opacity: 0.6 },
  confirmButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});