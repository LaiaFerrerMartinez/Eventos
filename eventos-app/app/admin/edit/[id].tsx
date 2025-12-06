// eventos-app/app/admin/edit/[id].tsx

import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { api } from '../../../src/api/client';
import { useAuth } from '../../../src/auth/AuthContext';
import { colors, fonts, spacing } from '../../../src/theme/tokens';

type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  video?: string;
};

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { can } = useAuth();
  const router = useRouter();

  if (!can('ITEM_EDIT')) {
    return <Redirect href="/" />;
  }

  const [event, setEvent] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getEvent(Number(id));
        setEvent({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          video: data.video,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading || !event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={fonts.body}>Cargando evento...</Text>
      </View>
    );
  }

  const e = event;

  async function handleSave() {
    // MODO MOCK: solo enseñamos alerta, sin tocar backend
    Alert.alert('Guardado', 'Evento actualizado (mock, sin backend).');
    router.back();
  }

  function setField<K extends keyof Evento>(key: K, value: Evento[K]) {
    setEvent(prev => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white, padding: spacing(2) }}
    >
      <Text style={fonts.h1}>Editar evento</Text>

      <Text style={[fonts.h2, { marginTop: spacing(2), fontSize: 14 }]}>
        Título
      </Text>
      <TextInput
        value={e.nombre}
        onChangeText={text => setField('nombre', text as any)}
        style={{
          borderWidth: 1,
          borderColor: colors.blueSoft,
          borderRadius: 8,
          padding: spacing(1),
        }}
      />

      <Text style={[fonts.h2, { marginTop: spacing(2), fontSize: 14 }]}>
        Descripción
      </Text>
      <TextInput
        value={e.descripcion}
        onChangeText={text => setField('descripcion', text as any)}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.blueSoft,
          borderRadius: 8,
          padding: spacing(1),
          minHeight: 80,
        }}
      />

      <Text style={[fonts.h2, { marginTop: spacing(2), fontSize: 14 }]}>
        URL vídeo (YouTube)
      </Text>
      <TextInput
        value={e.video ?? ''}
        onChangeText={text => setField('video', text as any)}
        style={{
          borderWidth: 1,
          borderColor: colors.blueSoft,
          borderRadius: 8,
          padding: spacing(1),
        }}
      />

      <Pressable
        onPress={handleSave}
        style={{
          marginTop: spacing(3),
          backgroundColor: colors.blue,
          borderRadius: 10,
          paddingVertical: spacing(1.5),
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: 'Inter_700Bold',
            fontSize: 16,
          }}
        >
          Guardar cambios
        </Text>
      </Pressable>
    </ScrollView>
  );
}
