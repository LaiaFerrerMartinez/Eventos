import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Pressable, Image, ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../src/theme/tokens';
import { api } from '../../src/api/client';
import * as ImagePicker from 'expo-image-picker';

export default function CreateEvent() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [imgUri, setImgUri] = useState<string | undefined>();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [video, setVideo] = useState('');
  const [puntuacion, setPuntuacion] = useState(0);

  useEffect(() => {
    api.listCategories().then(setCategorias).catch(() => {});
  }, []);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Se necesita permiso para acceder a la galería');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets.length > 0) {
      setImgUri(res.assets[0].uri);
    }
  }

  function formatFecha(fecha: string) {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
  }

  async function submit() {
    if (!nombre || !fecha || categoriasSeleccionadas.length === 0 || !imgUri) {
      Alert.alert('Completa todos los campos');
      return;
    }
    setBusy(true);
    try {
      const fileName = imgUri.split('/').pop()!;
      const presign = await api.getPresign(fileName);
      const imgBlob = await (await fetch(imgUri)).blob();
      const uploadRes = await fetch(presign.url, {
        method: 'PUT',
        body: imgBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      });
      const errorText = await uploadRes.text();
      if (!uploadRes.ok) throw new Error('Error subiendo imagen: ' + errorText);

      const fechaFormateada = formatFecha(fecha);
      await api.createEvent({
        nombre,
        descripcion,
        fecha: fechaFormateada,
        id_usuario: 1,
        categorias: categoriasSeleccionadas,
        img_evento: presign.key,
        video,
        puntuacion,
      });

      Alert.alert('Evento creado');
      setNombre('');
      setFecha('');
      setCategoriasSeleccionadas([]);
      setImgUri(undefined);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el evento');
    }
    setBusy(false);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white, padding: spacing(2), paddingBottom: spacing(0) }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing(5) }}>
        <Text style={fonts.h1}>Crear evento</Text>

        <Text style={[fonts.h2, { marginTop: spacing(2) }]}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={{ ...fonts.input, backgroundColor: colors.blueSoft, marginBottom: spacing(2), paddingHorizontal: spacing(2), borderRadius: 8 }}
          placeholder="Título del evento"
        />

        <Text style={fonts.h2}>Fecha</Text>
        <TextInput
          value={fecha}
          onChangeText={setFecha}
          style={{ ...fonts.input, backgroundColor: colors.blueSoft, marginBottom: spacing(2), paddingHorizontal: spacing(2), borderRadius: 8 }}
          placeholder="YYYY-MM-DD"
        />

        <Text style={fonts.h2}>Categorías</Text>
        <FlatList
          horizontal
          data={categorias}
          keyExtractor={(item: any) => String(item.id_categoria)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing(1) }}
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center', marginRight: spacing(1.5) }}>
              <Pressable
                onPress={() =>
                  setCategoriasSeleccionadas(s =>
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
                  borderWidth: categoriasSeleccionadas.includes(item.id_categoria) ? 2 : 0,
                  borderColor: categoriasSeleccionadas.includes(item.id_categoria) ? colors.blue : 'transparent',
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

        <Text style={fonts.h2}>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={{ ...fonts.input, backgroundColor: colors.blueSoft, marginBottom: spacing(2), paddingHorizontal: spacing(2), borderRadius: 8 }}
          placeholder="Descripción del evento"
        />

        <Text style={fonts.h2}>URL del video</Text>
        <TextInput
          value={video}
          onChangeText={setVideo}
          style={{ ...fonts.input, backgroundColor: colors.blueSoft, marginBottom: spacing(2), paddingHorizontal: spacing(2), borderRadius: 8 }}
          placeholder="URL del video (opcional)"
        />

        <Text style={fonts.h2}>Puntuación</Text>
        <TextInput
          value={String(puntuacion)}
          onChangeText={txt => setPuntuacion(Number(txt))}
          keyboardType="number-pad"
          style={{ ...fonts.input, backgroundColor: colors.blueSoft, marginBottom: spacing(2), paddingHorizontal: spacing(2), borderRadius: 8 }}
          placeholder="Puntuación"
        />

        <Pressable
          onPress={pickImage}
          style={{
            backgroundColor: colors.blueSoft,
            padding: spacing(2),
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.blue }}>Seleccionar imagen</Text>
        </Pressable>
        {imgUri && (
          <Image source={{ uri: imgUri }} style={{ width: 120, height: 120, borderRadius: 10, marginTop: spacing(2) }} />
        )}

        <Pressable
          onPress={submit}
          disabled={busy}
          style={{
            backgroundColor: colors.blue,
            padding: spacing(1.5),
            borderRadius: 8,
            alignItems: 'center',
            marginTop: spacing(3),
            opacity: busy ? 0.5 : 1,
          }}
        >
          {busy ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Crear evento</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
