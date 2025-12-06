// eventos-app/app/role.tsx

import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { colors, fonts, spacing } from '../src/theme/tokens';

export default function RoleSelectionScreen() {
  const { setUserById } = useAuth();
  const router = useRouter();

  async function chooseUser(idUsuario: number) {
    await setUserById(idUsuario);
    router.replace('/');
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
      <Text style={[fonts.h1, { marginBottom: spacing(3) }]}>
        Selecciona usuario
      </Text>

      {/* Ejemplos: cambia los ids por los que tengas como ADMIN / USER */}
      <Pressable
        onPress={() => chooseUser(1)} // por ejemplo Ana (ADMIN)
        style={{
          padding: spacing(2),
          borderRadius: 10,
          backgroundColor: colors.blue,
          marginBottom: spacing(2),
        }}
      >
        <Text style={[fonts.h2, { color: colors.white }]}>
          Entrar como Ana (admin)
        </Text>
      </Pressable>

      <Pressable
        onPress={() => chooseUser(2)} // por ejemplo Bruno (USER)
        style={{
          padding: spacing(2),
          borderRadius: 10,
          backgroundColor: colors.blueSoft,
        }}
      >
        <Text style={[fonts.h2, { color: colors.blue }]}>
          Entrar como Bruno (usuario)
        </Text>
      </Pressable>
    </View>
  );
}
