import React from 'react';

import { createBottomTabNavigator } 
  from '@react-navigation/bottom-tabs';

import BrowseRoomsScreen 
  from '../screens/BrowseRoomsScreen';

import MyBookingsScreen 
  from '../screens/MyBookingsScreen';

import ProfileScreen 
  from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Browse Rooms"
        component={BrowseRoomsScreen}
      />

      <Tab.Screen
        name="My Bookings"
        component={MyBookingsScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

    </Tab.Navigator>
  );
}