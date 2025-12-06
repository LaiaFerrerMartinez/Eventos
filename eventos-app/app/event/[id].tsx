import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { Rating } from '../../src/components/Rating';
import { colors, fonts, spacing } from '../../src/theme/tokens';

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>();
  const [showVideo, setShowVideo] = useState(false);
  const { can } = useAuth();
  if (!can('ITEM_DETAIL')) return <Redirect href="/" />;

  useEffect(() => {
    api.getEvent(Number(id)).then(setEvent);
  }, [id]);

  if (!event) return null;

  const youtubeId = event.video
    ? event.video.split('v=')[1]?.split('&')[0]
    : null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <Image
        source={{
          uri:
            event.img_evento_url ??
            (event.img_evento
              ? `https://tu-bucket-sprint1.s3.amazonaws.com/${event.img_evento}`
              : `https://picsum.photos/seed/${event.id}/900/600`),
        }}
        style={{ width: '100%', height: 280 }}
      />

      <View style={{ padding: spacing(2) }}>
        <Text style={fonts.h1}>{event.nombre}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing(1),
          }}
        >
          <Rating value={Number(event.puntuacion) || 0} />
          <Text style={[fonts.date, { fontSize: 18, fontWeight: 'bold' }]}>
            {(() => {
              const [year, month, day] = event.fecha.split('-');
              return `${day}/${month}/${year}`;
            })()}
          </Text>
        </View>

        {event.video && youtubeId && (
          <>
            <Pressable
              style={{
                backgroundColor: colors.blueSoft,
                padding: spacing(1.5),
                borderRadius: 8,
                alignItems: 'center',
                marginTop: spacing(2),
              }}
              onPress={() => setShowVideo(v => !v)}
            >
              <Text
                style={{
                  color: colors.blue,
                  fontFamily: 'Inter_700Bold',
                  fontWeight: 'bold',
                }}
              >
                {showVideo ? 'Ocultar video del evento' : 'Ver video del evento'}
              </Text>
            </Pressable>

            {showVideo && (
              <View style={{ marginTop: spacing(1.5) }}>
                <YoutubePlayer height={220} play={true} videoId={youtubeId} />
              </View>
            )}
          </>
        )}

        <Text
          style={[
            fonts.h2,
            { marginTop: spacing(2), fontWeight: 'bold' },
          ]}
        >
          Descripción
        </Text>
        <Text style={[fonts.body, { marginTop: spacing(1) }]}>
          {event.descripcion}
        </Text>

        <Text
          style={[
            fonts.h2,
            { marginTop: spacing(2), fontWeight: 'bold' },
          ]}
        >
          Tecnologías usadas
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: spacing(1.5),
            marginTop: spacing(1),
          }}
        >
          {(event.categorias || []).slice(0, 5).map((c: any) => (
            <View key={c.id_categoria} style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.blueSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}
              >
                <Image
                  source={{
                    uri: c.img_categoria
                      ? `https://tu-bucket-sprint1.s3.amazonaws.com/${c.img_categoria}`
                      : 'https://via.placeholder.com/35',
                  }}
                  style={{ width: 32, height: 32, resizeMode: 'contain' }}
                />
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: spacing(1),
            marginTop: spacing(2),
          }}
        >
          {can('ITEM_EDIT') && (
            <Pressable
              onPress={() => router.push(`/admin/edit/${event.id}` as any)}
              style={{
                paddingHorizontal: spacing(1.5),
                paddingVertical: spacing(0.5),
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.blue,
              }}
            >
              <Text
                style={{
                  color: colors.blue,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Editar
              </Text>
            </Pressable>
          )}

          {can('ITEM_DEACTIVATE') && (
            <Pressable
              onPress={() => {
                // mock de desactivación
              }}
              style={{
                paddingHorizontal: spacing(1.5),
                paddingVertical: spacing(0.5),
                borderRadius: 6,
                backgroundColor: colors.red,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Desactivar
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
