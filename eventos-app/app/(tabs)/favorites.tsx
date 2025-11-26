import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList } from 'react-native';
import { EventCard } from '../../src/components/EventCard';
import { api } from '../../src/api/client';
import { fonts, spacing, colors } from '../../src/theme/tokens';

// Helper para array plano o { items: [...] }
function getArray(data: any) {
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export default function FavoritesPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      async function load() {
        const favsRes = await api.favoritesOf(1);
        const favs = Array.isArray(favsRes) ? favsRes : (favsRes?.items ?? []);
        const favIds = new Set(favs.map((f: any) => f.evento?.id ?? f.id_evento));
        const evRes = await api.listEvents('', undefined, 1, 100);
        const items = getArray(evRes);
        if (alive)
          setEvents(items.filter((evt: any) => favIds.has(evt.id)).map((evt: any) => ({
            ...evt,
            isFavorite: true,
          })));
      }
      load().catch(() => {});
      return () => { alive = false; };
    }, [reloadFlag])
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white, paddingLeft: spacing(0.225) }}>
      <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(1), paddingBottom: spacing(1) }}>
        <Text style={[fonts.h1, { fontWeight: 'bold' }]}>Favoritos</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(evt: any) => String(evt.id)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: spacing(2),
        }}
        renderItem={({ item }: { item: any }) =>
          <EventCard
            event={item}
            onToggleFavorite={() => setReloadFlag(f => !f)}
          />
        }
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
