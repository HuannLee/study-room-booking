import React from 'react';
import { Text, Image, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, Layout, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Room } from '../types/room';
import { getRoomImageSource } from '../data/roomImages';

interface RoomCardProps {
  room: Room;
  index: number;
  onPress: () => void;
}

export default function RoomCard({ room, index, onPress }: RoomCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      layout={Layout.springify()}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animStyle]}>
          <Image 
            source={getRoomImageSource(room.id, room.image)} 
            style={styles.image} 
            resizeMode="cover"
          />
          <Animated.View style={styles.info}>
            <Animated.View style={styles.info}>
              <Animated.View style={styles.headerRow}>
                <Text style={styles.name}>{room.name}</Text>
                {/* Hiển thị quy mô phòng thay cho status cố định */}
                <Text style={styles.badgeSize}>{room.size}</Text>
              </Animated.View>
              <Text style={styles.detail}>
                Tòa nhà: {room.building} · Sức chứa: {room.capacity} chỗ
              </Text>
            </Animated.View>
            <Text style={styles.detail}>
              Tòa nhà: {room.building} · Sức chứa: {room.capacity} ({room.size})
            </Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: 140 },
  info: { padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  detail: { fontSize: 13, color: '#64748b', marginTop: 4 },
  badge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeAvailable: { backgroundColor: '#dcfce7', color: '#16a34a' },
  badgeOccupied: { backgroundColor: '#fee2e2', color: '#dc2626' },
  badgeSize: {fontSize: 12,
  fontWeight: '600', paddingHorizontal: 8,paddingVertical: 2,borderRadius: 6,backgroundColor: '#e0f2fe',color: '#0369a1',
},
});