import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { RoomStatus, RoomSize, RootStackParamList } from '../types/room';
import RoomCard from '../components/RoomCard';
import { useAppStore } from '../store/useAppStore';
import { fetchRoomsApi } from '../api/roomsAPI';

export default function BrowseRoomsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { filters, setSearch, setStatusFilter, setSizeFilter, setBuildingFilter, resetFilters } = useAppStore();

  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRoomsApi,
  });

  const buildings = ['All', 'A', 'B', 'C', 'D'];
  const sizes: ('All' | RoomSize)[] = ['All', 'Small', 'Medium', 'Large'];
  const statuses: ('All' | RoomStatus)[] = ['All', 'Available', 'Occupied'];

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch = room.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === 'All' || room.status === filters.status;
      const matchSize = filters.size === 'All' || room.size === filters.size;
      const matchBuilding = filters.building === 'All' || room.building === filters.building;
      return matchSearch && matchStatus && matchSize && matchBuilding;
    });
  }, [rooms, filters]);

  const isFiltering = filters.search !== '' || filters.status !== 'All' || filters.size !== 'All' || filters.building !== 'All';

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải danh sách 20+ phòng học...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Có lỗi xảy ra khi tải dữ liệu</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phòng theo tên (vd: Lab, Study)..."
          placeholderTextColor="#94a3b8"
          value={filters.search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        {isFiltering && (
          <TouchableOpacity onPress={resetFilters} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Xóa lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Sections */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          <Text style={styles.filterLabel}>Trạng thái:</Text>
          {statuses.map((st) => (
            <TouchableOpacity
              key={st}
              style={[styles.chip, filters.status === st && styles.chipActive]}
              onPress={() => setStatusFilter(st)}
            >
              <Text style={filters.status === st ? styles.chipTextActive : styles.chipText}>{st}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          <Text style={styles.filterLabel}>Kích thước:</Text>
          {sizes.map((sz) => (
            <TouchableOpacity
              key={sz}
              style={[styles.chip, filters.size === sz && styles.chipActive]}
              onPress={() => setSizeFilter(sz)}
            >
              <Text style={filters.size === sz ? styles.chipTextActive : styles.chipText}>{sz}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          <Text style={styles.filterLabel}>Tòa nhà:</Text>
          {buildings.map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.chip, filters.building === b && styles.chipActive]}
              onPress={() => setBuildingFilter(b)}
            >
              <Text style={filters.building === b ? styles.chipTextActive : styles.chipText}>{b}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Counter kết quả */}
      <View style={styles.resultInfoRow}>
        <Text style={styles.resultInfoText}>Hiển thị {filteredRooms.length} phòng</Text>
      </View>

      {/* Room FlatList */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onPress={() => navigation.navigate('RoomDetail', { room: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#2563eb']} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptySubtitle}>Thử tìm từ khóa khác hoặc bấm nút 'Xóa lọc' bên trên.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  errorTitle: { fontSize: 16, color: '#ef4444', fontWeight: '600', marginBottom: 12 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, gap: 10 },
  searchInput: { flex: 1, height: 42, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 14, color: '#0f172a' },
  clearBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fee2e2', borderRadius: 8 },
  clearBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  filterSection: { paddingVertical: 6, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  chipRow: { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 3 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', alignSelf: 'center', marginRight: 8, minWidth: 68 },
  chip: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#f1f5f9', marginRight: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { fontSize: 12, color: '#334155' },
  chipTextActive: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  resultInfoRow: { paddingHorizontal: 16, paddingTop: 8 },
  resultInfoText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 30 },
  emptyContainer: { alignItems: 'center', marginTop: 50, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },
});