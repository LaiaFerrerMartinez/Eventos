import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius, spacing, shadows } from '../theme/tokens';
import { Rating } from './Rating';
import { api } from '../api/client';

type EventItem = {
  id: number;
  nombre: string;
  puntuacion: number;
  fecha: string | Date;
  img_evento?: string; // <-- Añade esta línea
  img_evento_url?: string;
  img_evento_public?: string;
  isFavorite?: boolean;
};


export function EventCard({
  event,
  onToggleFavorite,
}: {
  event: EventItem;
  onToggleFavorite?: () => void; // callback que tu pantalla usará para recargar datos tras el toggle
}) {
  const router = useRouter();
  const [fav, setFav] = useState<boolean>(!!event.isFavorite);
  const [busy, setBusy] = useState<boolean>(false);

  // Sincroniza el estado interno del corazón con el estado externo cada vez que cambias de evento o favoritos recargados
  useEffect(() => {
    setFav(!!event.isFavorite);
  }, [event.isFavorite, event.id]);

  async function toggleFav() {
    if (busy) return;
    const next = !fav;
    setFav(next); // actualización optimista
    setBusy(true);
    try {
      if (next) await api.addFavorite(event.id); // marca como favorito en backend
      else await api.removeFavorite(event.id);   // desmarca en backend
      // pide a la pantalla actual que recargue eventos+favoritos cruzados
      if (onToggleFavorite) onToggleFavorite();
    } catch {
      setFav(!next); // revierte si hay error
    } finally {
      setBusy(false);
    }
  }

  const imageUri =
  event.img_evento_url ??
  event.img_evento_public ??
  (event.img_evento
    ? `https://tu-bucket-sprint1.s3.amazonaws.com/${event.img_evento}`
    : `https://picsum.photos/seed/${event.id}/300/200`);


  return (
    <Pressable
      onPress={() => router.push(`/event/${event.id}`)}
      style={{ width: 156, marginRight: spacing(1.5) }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 156,
            height: 156,
            borderRadius: radius.md,
            backgroundColor: colors.blueSoft,
          }}
        />
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleFav();
          }}
          style={{
            position: 'absolute',
            top: spacing(1),
            right: spacing(1),
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.blueSoft,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.light,
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={20}
            color={fav ? colors.blue : colors.blue}
          />
        </Pressable>
      </View>
      <Text numberOfLines={2} style={[fonts.h2, { fontSize: 16, marginTop: spacing(1) }]}>
        {event.nombre}
      </Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: spacing(0.4),
          marginTop: spacing(0.5),
        }}
      >
        <Rating value={Number(event.puntuacion) || 0} />
        <Text style={[fonts.secondary, { fontWeight: 'bold', color: colors.black, fontSize: 18, marginBottom: spacing(2) }]}>
  {(() => {
    // Si event.fecha viene como string "2025-02-15"
    if (typeof event.fecha === 'string' && event.fecha.includes('-')) {
      const [year, month, day] = event.fecha.split('-');
      return `${day}/${month}/${year}`;
    }
    // Si viene como Date nativo
    const date = new Date(event.fecha);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  })()}
</Text>

      </View>
    </Pressable>
  );
}
