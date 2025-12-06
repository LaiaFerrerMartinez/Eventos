// eventos-app/app/(tabs)/profile.tsx

import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { EventCard } from '../../src/components/EventCard';
import { colors, fonts, spacing } from '../../src/theme/tokens';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const router = useRouter();
  const { currentUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      // Si no hay usuario logueado en el AuthContext → ir al login
      if (!currentUser) {
        router.replace('/login');
        return () => {
          alive = false;
        };
      }

      const userId = currentUser.id;

      api
        .getUser(userId)
        .then(u => {
          if (alive) setUser(u);
        })
        .catch(() => {});

      Promise.all([
        api.listEvents('', undefined, 1, 50),
        api.favoritesOf(userId),
      ]).then(([evRes, favsRes]) => {
        const items = evRes.items ?? evRes;
        const favs = Array.isArray(favsRes)
          ? favsRes
          : favsRes?.items ?? [];
        const favIds = new Set(
          favs.map((f: any) => f.evento?.id ?? f.id_evento),
        );
        if (alive)
          setMyEvents(
            items
              .filter(
                (e: any) => e.usuario?.id_usuario === userId,
              )
              .map((e: any) => ({
                ...e,
                isFavorite: favIds.has(e.id),
              })),
          );
      });

      return () => {
        alive = false;
      };
    }, [currentUser, router]),
  );

  // Si aún no hay currentUser (cargando) muestra algo simple
  if (!currentUser) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}
      >
        <Text style={fonts.body}>Redirigiendo al login...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: spacing(2),
        paddingTop: spacing(2),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing(1.5),
          paddingTop: spacing(2),
          paddingBottom: spacing(2),
        }}
      >
        <Image
          source={{
            uri:
              user?.avatar_url ??
              'https://tu-bucket-sprint1.s3.us-east-1.amazonaws.com/perfil/ce273ed5-9962-4902-a6e2-4dcea0ffe385.png',
          }}
          style={{ width: 60, height: 60, borderRadius: 15 }}
        />
        <View>
          <Text
            style={[
              fonts.h1,
              { marginLeft: spacing(1), fontWeight: 'bold', fontSize: 40 },
            ]}
          >
            {user?.nombre_usuario ?? 'Usuario'}
          </Text>
          
        </View>
      </View>

      {/* BOTÓN PARA IR AL LOGIN / CAMBIAR USUARIO */}
      <Pressable
        onPress={() => router.push('/login')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: spacing(2),
          backgroundColor: colors.blue,
          paddingHorizontal: spacing(2),
          paddingVertical: spacing(1),
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: 'Inter_600SemiBold',
          }}
        >
          Cambiar de usuario
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            fonts.h2,
            { fontSize: 24, fontWeight: 'bold', paddingBottom: spacing(2) },
          ]}
        >
          Eventos que ha creado
        </Text>
      </View>

      <FlatList
        data={myEvents}
        keyExtractor={e => String(e.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <EventCard event={item} />}
        style={{ marginTop: spacing(0) }}
      />
    </View>
  );
}
