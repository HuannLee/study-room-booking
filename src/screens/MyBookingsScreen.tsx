import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function MyBookingsScreen() {
  const { bookings, cancelBooking } = useAppStore();

  const handleCancel = (id: string, name: string) => {
    Alert.alert('Hủy phòng', `Bạn chắc chắn muốn hủy lịch đặt ${name}?`, [
      { text: 'Không' },
      { text: 'Hủy lịch', style: 'destructive', onPress: () => cancelBooking(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có lịch đặt phòng nào.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.roomName}>{item.roomName}</Text>
              <TouchableOpacity onPress={() => handleCancel(item.id, item.roomName)}>
                <Text style={styles.cancelAction}>Hủy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detail}>Khu vực: Tòa {item.building}</Text>
            <Text style={styles.detail}>Ngày: {item.date}</Text>
            <Text style={styles.detail}>Khung giờ: {item.timeSlot}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  roomName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  cancelAction: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  detail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },
});