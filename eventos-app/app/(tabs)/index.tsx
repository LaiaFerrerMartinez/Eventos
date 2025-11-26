import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, FlatList, ScrollView, Image, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { colors, fonts, spacing } from '../../src/theme/tokens';
import { EventCard } from '../../src/components/EventCard';
import { BannerCarousel } from '../../src/components/BannerCarousel';
import { api } from '../../src/api/client';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<number | undefined>();
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(false); // Para refrescar tras toggle

  const router = useRouter();

  // Actualiza todo al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      
      // Usuario
      api.getUser(1).then(u => { if (alive) setUser(u); }).catch(() => {});
      // Categorías
      api.listCategories().then(cats => { if (alive) setCategories(cats); }).catch(() => {});
      // Eventos y favoritos
      Promise.all([
        api.listEvents(q, cat, 1, 10),
        api.favoritesOf(1),
      ]).then(([ev, favs]) => {
        const items = ev.items ?? ev;
        const favIds = new Set((favs || []).map((f: any) => (f.evento?.id ?? f.id_evento)));
        if (alive) setEvents(items.map((e: any) => ({ ...e, isFavorite: favIds.has(e.id) })));
      }).catch(() => {});
      
      return () => { alive = false; };
    }, [q, cat, reloadFlag])
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white, paddingLeft: spacing(0.225) }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing(1), paddingBottom: 0 }}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        overScrollMode="never"
      >
        <View style={{ paddingHorizontal: spacing(2) }}>
          {/* Cabecera con avatar + textos */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing(1.5),
              marginBottom: spacing(1),
            }}
          >
            <Image
              source={{ uri: user?.avatar_url ?? 'https://tu-bucket-sprint1.s3.us-east-1.amazonaws.com/perfil/ce273ed5-9962-4902-a6e2-4dcea0ffe385.png' }}
              style={{ width: 60, height: 60, borderRadius: 15 }}
            />
            <View style={{ gap: 0, marginTop: spacing(1) }}>
              <Text style={fonts.secondary}>¡Hola!</Text>
              <Text style={[fonts.h1, { marginBottom: spacing(0.5), fontWeight: 'bold' }]}>
                {user?.nombre_usuario ?? 'Usuario'}
              </Text>
            </View>
          </View>
          {/* Buscador */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.blueSoft,
              borderRadius: 10,
              paddingHorizontal: spacing(2),
              paddingVertical: spacing(1),
              marginTop: spacing(1),
            }}
          >
           <Ionicons
  name="search"
  size={20}
  color={colors.blue}
  style={{ transform: [{ scaleX: -1 }], marginRight: 8 }}
/>

            <TextInput
              placeholder="Buscar eventos..."
              placeholderTextColor={colors.gray}
              value={q}
              onChangeText={setQ}
              style={{
                flex: 1,
                paddingVertical: spacing(0.5),
                color: colors.black,
              }}
            />
          </View>
          {/* Chips de categorías */}
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c: any) => String(c.id_categoria)}
            contentContainerStyle={{ paddingVertical: spacing(1) }}
            renderItem={({ item }) => (
              <View style={{ alignItems: 'center', marginRight: spacing(1.5) }}>
                <Pressable
                  onPress={() => setCat(cat === item.id_categoria ? undefined : item.id_categoria)}
                  style={{
                    marginTop: spacing(1),
                    width: 55,
                    height: 55,
                    borderRadius: 55 / 2,
                    backgroundColor: colors.blueSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: cat === item.id_categoria ? 2 : 0,
                    borderColor: cat === item.id_categoria ? colors.blue : 'transparent',
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
        {/* Banner carrusel */}
        <BannerCarousel
          images={[
            'https://tu-bucket-sprint1.s3.amazonaws.com/carrusel/8dee54a7-b6b9-4927-96d3-e08869c595cd.png',
            'https://tu-bucket-sprint1.s3.amazonaws.com/carrusel/62eb5c9d-b47f-4009-93f4-75fc25bbf81e.png',
            'https://tu-bucket-sprint1.s3.amazonaws.com/carrusel/5766eaed-47be-4a63-b042-5207dfebfb70.png',
            'https://tu-bucket-sprint1.s3.amazonaws.com/carrusel/b4acf689-8fa0-4aa2-afc4-bf131be686dd.png',
          ]}
        />
        {/* Lista horizontal de eventos */}
        <View
          style={{
            paddingHorizontal: spacing(2),
            marginTop: spacing(2),
            paddingBottom: 0,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[fonts.h2, { fontSize: 24, fontWeight: 'bold' }]}>Nuevos eventos</Text>
            <Pressable onPress={() => router.push('/categories')}>
              <Text style={[fonts.secondary, { fontSize: 14, color: colors.blue, marginTop: spacing(0.5), marginRight: spacing(1) }]}>
                Ver más
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={events}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(e: any) => String(e.id)}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onToggleFavorite={() => setReloadFlag(f => !f)}
              />
            )}
            style={{ marginTop: spacing(1.5) }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
