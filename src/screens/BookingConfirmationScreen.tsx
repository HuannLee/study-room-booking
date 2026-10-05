import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/room';
import { useAppStore } from '../store/useAppStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const booking = useAppStore((state) =>
    state.bookings.find((b) => b.id === bookingId)
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={72} color="#10B981" />
        <Text style={styles.title}>Đặt phòng thành công!</Text>
        <Text style={styles.subtitle}>Mã đặt chỗ: #{bookingId}</Text>

        {booking && (
          <View style={styles.details}>
            <Text style={styles.detailRow}>Phòng: {booking.roomName}</Text>
            <Text style={styles.detailRow}>Tòa nhà: {booking.building}</Text>
            <Text style={styles.detailRow}>Ngày: {booking.date}</Text>
            <Text style={styles.detailRow}>Khung giờ: {booking.timeSlot}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.doneText}>Về màn hình chính</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', marginTop: 12, color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 16 },
  details: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  detailRow: { fontSize: 15, color: '#334155' },
  doneButton: {
    width: '100%',
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});