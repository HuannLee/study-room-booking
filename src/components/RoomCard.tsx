import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
  onPress?: () => void;
}

export default function RoomCard({ room, onPress }: RoomCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: room.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{room.name}</Text>
          <View style={[styles.badge, room.status === 'Available' ? styles.badgeAvailable : styles.badgeOccupied]}>
            <Text style={styles.badgeText}>{room.status}</Text>
          </View>
        </View>
        <Text style={styles.meta}>Khu vực: Tòa {room.building}</Text>
        <Text style={styles.meta}>{room.capacity} chỗ · Quy mô: {room.size}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 140 },
  content: { padding: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 17, fontWeight: '700', color: '#1e293b', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeAvailable: { backgroundColor: '#dcfce7' },
  badgeOccupied: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
  meta: { fontSize: 13, color: '#64748b', marginTop: 3 },
});