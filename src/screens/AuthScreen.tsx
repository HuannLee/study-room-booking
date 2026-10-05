import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { loginApi, registerApi } from '../api/roomsAPI';
import { useAppStore } from '../store/useAppStore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const authMutation = useMutation({
    mutationFn: () => (isLogin ? loginApi({ email, password }) : registerApi({ name, email, password })),
    onSuccess: (user) => {
      setCurrentUser(user);
    },
    onError: (err: any) => {
      Alert.alert('Lỗi xác thực', err.message || 'Không thể kết nối đến máy chủ.');
    },
  });

  const handleSubmit = () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin.');
      return;
    }
    authMutation.mutate();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>VKU StudyRoom</Text>
        <Text style={styles.headerSubtitle}>Đặt phòng học & Phòng Lab trực tuyến</Text>

        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <TextInput
            placeholder="Họ và tên của bạn"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />
        )}

        <TextInput
          placeholder="Email trường VKU (@vku.udn.vn)"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={[styles.actionBtn, authMutation.isPending && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={authMutation.isPending}
        >
          {authMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionBtnText}>{isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E3A5F', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A5F', textAlign: 'center' },
  headerSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 20 },
  tabToggle: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4, marginBottom: 18 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#fff', elevation: 1 },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#1E3A5F', fontWeight: '700' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  actionBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});