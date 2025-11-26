import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { colors, fonts, spacing } from '../../src/theme/tokens';
import { api } from '../../src/api/client';
import { EventCard } from '../../src/components/EventCard';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [myEvents, setMyEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.getUser(1).then(u => { if (alive) setUser(u); }).catch(() => {});

      Promise.all([
        api.listEvents('', undefined, 1, 50),
        api.favoritesOf(1),
      ]).then(([evRes, favsRes]) => {
        const items = evRes.items ?? evRes;
        const favs = Array.isArray(favsRes) ? favsRes : (favsRes?.items ?? []);
        const favIds = new Set(favs.map((f: any) => f.evento?.id ?? f.id_evento));
        if (alive) setMyEvents(
          items
            .filter((e: any) => e.usuario?.id_usuario === 1)
            .map((e: any) => ({ ...e, isFavorite: favIds.has(e.id) }))
        );
      });
      return () => { alive = false; };
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing(2), paddingTop: spacing(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1.5), paddingTop: spacing(2), paddingBottom: spacing(2) }}>
        <Image
          source={{
            uri: user?.avatar_url ?? 'https://tu-bucket-sprint1.s3.us-east-1.amazonaws.com/perfil/ce273ed5-9962-4902-a6e2-4dcea0ffe385.png'
          }}
          style={{ width: 60, height: 60, borderRadius: 15 }}
        />
        <View>
          <Text style={[fonts.h1, { marginLeft: spacing(1), fontWeight: 'bold', fontSize: 40 }]}>
            {user?.nombre_usuario ?? 'Usuario'}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[fonts.h2, { fontSize: 24, fontWeight: 'bold', paddingBottom: spacing(2) }]}>Eventos que ha creado</Text>
      </View>
      <FlatList
        data={myEvents}
        keyExtractor={(e) => String(e.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <EventCard event={item} />}
        style={{ marginTop: spacing(0) }}
      />
    </View>
  );
}
