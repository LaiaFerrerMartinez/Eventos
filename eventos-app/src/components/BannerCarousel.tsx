import { Dimensions, FlatList, Image, View } from 'react-native';
import { useRef, useState } from 'react';
import { radius, spacing, colors } from '../theme/tokens';

const W = Dimensions.get('window').width;
const CARD_W = Math.round(W * 0.9);
const CARD_H = 200;
const GUTTER = spacing(2);

export function BannerCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList<string>>(null);

  return (
    <View>
      <FlatList
        ref={ref}
        data={images}
        keyExtractor={(u) => u}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled               // una imagen por “página”
        snapToAlignment="center"    // alinea al centro
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (W - CARD_W) / 2 }} // centra el 90%
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(x / W); // pagingEnabled usa ancho de pantalla
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width: W /* ocupa la página completa */ }}>
            <View
              style={{
                marginTop: spacing(1),
                width: CARD_W,
                height: CARD_H,
                borderRadius: radius.xl,
                overflow: 'hidden',
                alignSelf: 'center',
              }}
            >
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </View>
        )}
      />

      {/* Dots de paginación */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          marginTop: spacing(1),
        }}
      >
        {images.slice(0, 4).map((_, i) => {
          const active = i === (index % 4);
          return (
            <View
              key={i}
              style={{
                
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: active ? colors.blue : colors.gray,
                opacity: active ? 1 : 0.4,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
