import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from './src/types/room';
import { useAppStore } from './src/store/useAppStore';
import AuthScreen from './src/screens/AuthScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import RoomDetailsScreen from './src/screens/RoomDetailScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  const currentUser = useAppStore((state) => state.currentUser);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {currentUser ? (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="MainTabs"
              screenOptions={{
                headerStyle: { backgroundColor: '#1E3A5F' },
                headerTintColor: '#fff',
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RoomDetails"
                component={RoomDetailsScreen}
                options={({ route }) => ({ title: route.params.room.name })}
              />
              <Stack.Screen
                name="BookingConfirmation"
                component={BookingConfirmationScreen}
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <AuthScreen />
        )}
        <StatusBar style="light" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}