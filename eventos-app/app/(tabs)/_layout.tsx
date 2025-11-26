import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
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
      {/* sombra azul clara opcional: ver variante con gradiente si quieres más suave */}
    </View>
  );
}

export default function TabsLayout() {
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'} // corazón como en el diseño
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="explore"
  options={{ href: null }}   // oculta la pestaña aunque el archivo exista
/>

      {/* Eliminado explore */}
    </Tabs>
  );
}
