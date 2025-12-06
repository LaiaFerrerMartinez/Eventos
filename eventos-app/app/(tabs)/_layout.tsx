// eventos-app/app/(tabs)/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { colors } from '../../src/theme/tokens';

function TabBarBackground() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: 2,
          backgroundColor: colors.blue,
        }}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { currentUser, loading, can } = useAuth();

  if (loading) return null;

  // AQUÍ el cambio: '/login' en vez de '/role'
  if (!currentUser) {
    return <Redirect href={'/login' as any} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 64,
          paddingBottom: 12,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarHideOnKeyboard: true,
        sceneStyle: { paddingBottom: 0 },
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      {/* resto igual que ya tienes */}
      {can('ITEM_LIST') && (
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {can('ITEM_LIST') && (
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Categories',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {can('FAVORITES_USE') && (
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      {can('ITEM_CREATE') && (
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      {can('ADMIN_PANEL_VIEW') && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {can('PROFILE_VIEW') && (
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
