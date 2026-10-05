import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { useAppStore } from '../store/useAppStore';
import { Booking } from '../types/room';

function BookingSwipeItem({
  item,
  canCancel,
  onCancel,
}: {
  item: Booking;
  canCancel: boolean;
  onCancel: (id: string, name: string) => void;
}) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .enabled(canCancel)
    .activeOffsetX(-10)
    .onUpdate((e) => {
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
      {canCancel && (
        <View style={styles.deleteBackground}>
          <Text style={styles.deleteBackgroundText}>Vuốt để Hủy</Text>
        </View>
      )}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.roomName}>{item.roomName}</Text>
            <Text style={[styles.statusBadge, canCancel ? styles.badgeUpcoming : styles.badgeDone]}>
              {canCancel ? 'Sắp tới' : 'Đã qua'}
            </Text>
          </View>
          <Text style={styles.detail}>Khu vực: Tòa {item.building}</Text>
          <Text style={styles.detail}>Ngày: {item.date}</Text>
          <Text style={styles.detail}>Khung giờ: {item.timeSlot}</Text>
          {canCancel && <Text style={styles.hintSwipe}>⟵ Vuốt sang trái để hủy lịch</Text>}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default function MyBookingsScreen() {
  const { bookings, cancelBooking, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { upcomingBookings, historyBookings } = useMemo(() => {
    // Chỉ lấy lịch của user hiện tại
    const userBookings = bookings.filter((b) => b.userId === currentUser.id);

    const upcoming: Booking[] = [];
    const history: Booking[] = [];

    userBookings.forEach((b) => {
      if (b.date > todayStr) {
        upcoming.push(b);
      } else if (b.date < todayStr) {
        history.push(b);
      } else {
        const [startPart] = b.timeSlot.split(' - ');
        const [slotHour, slotMinute] = startPart.split(':').map(Number);
        if (now.getHours() > slotHour || (now.getHours() === slotHour && now.getMinutes() >= slotMinute)) {
          history.push(b);
        } else {
          upcoming.push(b);
        }
      }
    });

    return { upcomingBookings: upcoming, historyBookings: history };
  }, [bookings, currentUser]);

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

  const handleCancel = (id: string, name: string) => {
    Alert.alert('Hủy phòng', `Bạn chắc chắn muốn hủy lịch đặt ${name}?`, [
      { text: 'Không' },
      { text: 'Hủy lịch', style: 'destructive', onPress: () => cancelBooking(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Thanh chuyển tab */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Sắp tới ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Lịch sử ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming'
                ? 'Không có lịch đặt phòng nào sắp tới.'
                : 'Chưa có lịch sử đặt phòng.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <BookingSwipeItem
            item={item}
            canCancel={activeTab === 'upcoming'}
            onCancel={handleCancel}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabButtonActive: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#fff' },
  listContent: { padding: 16 },
  itemWrapper: { marginBottom: 12, position: 'relative', borderRadius: 10, overflow: 'hidden' },
  deleteBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 10,
  },
  deleteBackgroundText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  roomName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  statusBadge: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontWeight: '600' },
  badgeUpcoming: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  badgeDone: { backgroundColor: '#f1f5f9', color: '#64748b' },
  detail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  hintSwipe: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94a3b8', fontSize: 14 },
});