import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
  const { currentUser, bookings } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{currentUser.name}</Text>
      <Text style={styles.email}>{currentUser.email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thống kê hoạt động</Text>
        <Text style={styles.stat}>Số phòng đã đặt: <Text style={{ fontWeight: 'bold' }}>{bookings.length}</Text></Text>
        <Text style={styles.stat}>Vai trò: <Text style={{ fontWeight: 'bold' }}>{currentUser.role}</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f8fafc', paddingTop: 40 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  email: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 24 },
  card: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 18, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#334155' },
  stat: { fontSize: 14, color: '#475569', marginVertical: 4 },
});