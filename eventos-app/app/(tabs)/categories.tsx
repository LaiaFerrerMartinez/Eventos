import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { colors, fonts, spacing } from '../../src/theme/tokens';
import { EventCard } from '../../src/components/EventCard';
import { api } from '../../src/api/client';

// Helper para array
function getArray(data: any) {
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      async function load() {
        // Pide todos los eventos (puedes limitar el número en producción)
        const [evRes, favsRes] = await Promise.all([
          api.listEvents('', undefined, 1, 100), // <-- No filtra por categoría en backend
          api.favoritesOf(1),
        ]);
        const items = getArray(evRes);
        const favs = Array.isArray(favsRes) ? favsRes : (favsRes?.items ?? []);
        const favIds = new Set(favs.map((f: any) => f.evento?.id ?? f.id_evento));
        // Filtra los eventos en local si hay categorías seleccionadas
        let filteredItems = items;
        if (selected.length > 0) {
          filteredItems = items.filter((evt: any) =>
            Array.isArray(evt.categorias)
              ? evt.categorias.some((c: any) => selected.includes(c.id_categoria))
              : false
          );
        }
        if (alive) setEvents(
          filteredItems.map((evt: any) => ({
            ...evt,
            isFavorite: favIds.has(evt.id),
          }))
        );
      }
      load().catch(() => {});
      return () => { alive = false; };
    }, [selected, reloadFlag])
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white, paddingLeft: spacing(0.225) }}>
      <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(1), paddingBottom: spacing(1) }}>
        <Text style={[fonts.h1, { fontWeight: 'bold' }]}>Categorías</Text>
        {/* Chips de categorías */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item: any) => String(item.id_categoria)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing(1) }}
          renderItem={({ item }: { item: any }) => (
            <View style={{ alignItems: 'center', marginRight: spacing(1.5) }}>
              <Pressable
                onPress={() =>
                  setSelected(s =>
                    s.includes(item.id_categoria)
                      ? s.filter(x => x !== item.id_categoria)
                      : [...s, item.id_categoria]
                  )
                }
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 27.5,
                  backgroundColor: colors.blueSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selected.includes(item.id_categoria) ? 2 : 0,
                  borderColor: selected.includes(item.id_categoria) ? colors.blue : 'transparent',
                }}
              >
                <Image
                  source={{
                    uri: item.img_categoria
                      ? `https://tu-bucket-sprint1.s3.amazonaws.com/${item.img_categoria}`
                      : 'https://via.placeholder.com/35'
                  }}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
              </Pressable>
            </View>
          )}
        />
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
