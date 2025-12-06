// eventos-app/app/login.tsx

import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { colors, fonts, spacing } from '../src/theme/tokens';

export default function LoginScreen() {
  const { setUserById } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin() {
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('Escribe un nombre de usuario.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await api.getUserByName(trimmed);
      // devuelve { id_usuario, nombre_usuario, rol }
      if (!user || !user.id_usuario) {
        setErrorMsg('Usuario inválido');
        return;
      }

      await setUserById(user.id_usuario);
      router.replace('/');
    } catch {
      setErrorMsg('Usuario inválido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: spacing(2),
        backgroundColor: colors.white,
      }}
    >
      <Text style={[fonts.h1, { marginBottom: spacing(2) }]}>
        Inicia sesión
      </Text>

      <Text style={[fonts.body, { marginBottom: spacing(2) }]}>
        Escribe tu nombre exactamente como en la tabla usuarios.
      </Text>

      <TextInput
        value={name}
        onChangeText={text => {
          setName(text);
          if (errorMsg) setErrorMsg(null);
        }}
        placeholder="Nombre de usuario"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: colors.blueSoft,
          borderRadius: 8,
          padding: spacing(1.5),
          marginBottom: spacing(1),
        }}
      />

      {errorMsg && (
        <Text
          style={{
            ...fonts.caption,
            color: colors.red,
            marginBottom: spacing(1),
          }}
        >
          {errorMsg}
        </Text>
      )}

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: colors.blue,
          borderRadius: 10,
          paddingVertical: spacing(1.5),
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text
            style={{
              color: colors.white,
              fontFamily: 'Inter_700Bold',
              fontSize: 16,
            }}
          >
            Entrar
          </Text>
        )}
      </Pressable>
    </View>
  );
}
