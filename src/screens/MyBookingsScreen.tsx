import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { useAppStore } from '../store/useAppStore';
import { Booking } from '../types/room';

function BookingSwipeItem({
  item,
  onCancel,
}: {
  item: Booking;
  onCancel: (id: string, name: string) => void;
}) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX(-10)
    .onUpdate((e) => {
      // Chỉ cho phép vuốt sang bên trái
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        runOnJS(onCancel)(item.id, item.roomName);
      }
      translateX.value = withSpring(0);
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteBackgroundText}>Vuốt để Hủy</Text>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Text style={styles.roomName}>{item.roomName}</Text>
          <Text style={styles.detail}>Khu vực: Tòa {item.building}</Text>
          <Text style={styles.detail}>Ngày: {item.date}</Text>
          <Text style={styles.detail}>Khung giờ: {item.timeSlot}</Text>
          <Text style={styles.hintSwipe}>⟵ Vuốt sang trái để hủy phòng</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có lịch đặt phòng nào.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BookingSwipeItem item={item} onCancel={handleCancel} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  listContent: { padding: 16 },
  itemWrapper: {
    marginBottom: 12,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  deleteBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 10,
  },
  deleteBackgroundText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  roomName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  detail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  hintSwipe: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94a3b8', fontSize: 15 },
});