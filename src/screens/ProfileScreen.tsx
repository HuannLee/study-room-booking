import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
  const { currentUser, bookings, logout } = useAppStore();

  const myBookingsCount = bookings.filter((b) => b.userId === currentUser?.id).length;

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn thoát khỏi tài khoản?', [
      { text: 'Hủy' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{currentUser?.name || 'Chưa đăng nhập'}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        <Text style={styles.roleBadge}>{currentUser?.role || 'Sinh viên'}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{myBookingsCount}</Text>
          <Text style={styles.statLabel}>Lượt đặt phòng</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Ionicons name="school-outline" size={20} color="#64748b" />
          <Text style={styles.menuLabel}>Trường: Đại học CNTT & TT Việt - Hàn (VKU)</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#64748b" />
          <Text style={styles.menuLabel}>Mã định danh: {currentUser?.id}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { alignItems: 'center', marginVertical: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  email: { fontSize: 13, color: '#64748b', marginTop: 2 },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  statCol: { alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#2563eb' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
  menu: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  menuLabel: { fontSize: 14, color: '#334155' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    padding: 14,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});