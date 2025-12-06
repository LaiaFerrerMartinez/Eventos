import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from 'react-native';
import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { colors, fonts, spacing } from '../../src/theme/tokens';

type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  categorias?: { id_categoria: number; nombre: string }[];
  activo?: boolean;
};

export default function AdminPanelScreen() {
  const { can } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  if (!can('ADMIN_PANEL_VIEW')) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={fonts.body}>No tienes acceso al panel de administración.</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await api.listEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = events.length;
    const activos = events.filter(e => e.activo !== false).length;
    const desactivados = total - activos;

    const porCategoria: Record<string, number> = {};
    events.forEach(e => {
      (e.categorias ?? []).forEach(c => {
        porCategoria[c.nombre] = (porCategoria[c.nombre] || 0) + 1;
      });
    });

    const topCategorias = Object.entries(porCategoria)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { total, activos, desactivados, topCategorias };
  }, [events]);

  function goToCreate() {
    if (!can('ITEM_CREATE')) return;
    router.push('/(tabs)/create');
  }

  function goToEdit(id: number) {
    if (!can('ITEM_EDIT')) return;
    router.push(`/admin/edit/${id}` as any);
  }

  function deactivate(id: number) {
    if (!can('ITEM_DEACTIVATE')) return;
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, activo: false } : e)),
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing(2) }}>
      <Text style={[fonts.h1, { marginBottom: spacing(2) }]}>
        Panel de administración
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: spacing(1.5),
          marginBottom: spacing(2),
          flexWrap: 'wrap',
        }}
      >
        <StatCard label="Total eventos" value={stats.total.toString()} />
        <StatCard label="Activos" value={stats.activos.toString()} />
        <StatCard label="Desactivados" value={stats.desactivados.toString()} />
        {stats.topCategorias.map(([nombre, count]) => (
          <StatCard
            key={nombre}
            label={`Cat. ${nombre}`}
            value={String(count)}
          />
        ))}
      </View>

      {can('ITEM_CREATE') && (
        <Pressable
          onPress={goToCreate}
          style={{
            backgroundColor: colors.blue,
            paddingVertical: spacing(1.5),
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: spacing(2),
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontFamily: 'Inter_700Bold',
              fontSize: 16,
            }}
          >
            Crear nuevo evento
          </Text>
        </Pressable>
      )}

      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: spacing(4) }}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.blueSoft,
              borderRadius: 10,
              padding: spacing(1.5),
              marginBottom: spacing(1.5),
              opacity: item.activo === false ? 0.5 : 1,
            }}
          >
            <Text style={[fonts.h2, { marginBottom: 4 }]}>{item.nombre}</Text>
            <Text style={[fonts.body, { marginBottom: 4 }]} numberOfLines={2}>
              {item.descripcion}
            </Text>
            <Text style={[fonts.caption, { marginBottom: 8 }]}>
              Categorías:{' '}
              {(item.categorias ?? []).map(c => c.nombre).join(', ') || 'N/A'}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: spacing(1),
              }}
            >
              {can('ITEM_EDIT') && (
                <Pressable
                  onPress={() => goToEdit(item.id)}
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

              {can('ITEM_DEACTIVATE') && item.activo !== false && (
                <Pressable
                  onPress={() => deactivate(item.id)}
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
        )}
      />
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        minWidth: 120,
        padding: spacing(1.5),
        borderRadius: 10,
        backgroundColor: colors.blueSoft,
      }}
    >
      <Text
        style={{
          ...fonts.caption,
          color: colors.gray,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          ...fonts.h2,
          color: colors.blue,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
