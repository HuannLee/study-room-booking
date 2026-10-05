import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { RootStackParamList } from '../types/room';
import { useAppStore } from '../store/useAppStore';
import { createBookingApi } from '../api/roomsAPI';

type RoomDetailsRouteProp = RouteProp<RootStackParamList, 'RoomDetails'>;

const AVAILABLE_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

const DATES = ['2026-10-05', '2026-10-06', '2026-10-07'];

export default function RoomDetailsScreen() {
  const route = useRoute<RoomDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { room } = route.params;

  const { currentUser, bookings, addBooking } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const bookingMutation = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (newBooking) => {
      addBooking(newBooking);
      // Chuyển sang màn hình Modal xác nhận theo đúng kiến trúc slide 8 & 9
      navigation.navigate('BookingConfirmation', { bookingId: newBooking.id });
    },
    onError: (error: any) => {
      Alert.alert('Đặt phòng thất bại', error.message || 'Có lỗi xảy ra.');
    },
  });

  const bookedSlots = bookings
    .filter((b) => b.roomId === room.id && b.date === selectedDate)
    .map((b) => b.timeSlot);

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
      userId: currentUser.id,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: room.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>Tòa nhà {room.building} · Sức chứa {room.capacity} chỗ ({room.size})</Text>

        <Text style={styles.sectionTitle}>1. Chọn ngày:</Text>
        <View style={styles.chipRow}>
          {DATES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dateChip, selectedDate === d && styles.chipActive]}
              onPress={() => {
                setSelectedDate(d);
                setSelectedSlot(null);
              }}
            >
              <Text style={selectedDate === d ? styles.chipTextActive : styles.chipText}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Chọn khung giờ:</Text>
        <View style={styles.slotGrid}>
          {AVAILABLE_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                disabled={isBooked || bookingMutation.isPending}
                style={[
                  styles.slotChip,
                  isSelected && styles.slotActive,
                  isBooked && styles.slotDisabled,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextActive,
                    isBooked && styles.slotTextDisabled,
                  ]}
                >
                  {slot}
                </Text>
                {isBooked && <Text style={styles.conflictBadge}>Đã kín</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, bookingMutation.isPending && { opacity: 0.7 }]}
          onPress={handleBooking}
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Xác nhận đặt phòng</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  image: { width: '100%', height: 220 },
  content: { padding: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  dateChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#e2e8f0' },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { color: '#334155', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  slotChip: { width: '48%', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff', alignItems: 'center' },
  slotActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  slotDisabled: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0', opacity: 0.6 },
  slotText: { fontSize: 13, color: '#1e293b', fontWeight: '500' },
  slotTextActive: { color: '#2563eb', fontWeight: '700' },
  slotTextDisabled: { color: '#94a3b8', textDecorationLine: 'line-through' },
  conflictBadge: { fontSize: 10, color: '#ef4444', fontWeight: '600', marginTop: 3 },
  confirmButton: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center', height: 50, justifyContent: 'center' },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});