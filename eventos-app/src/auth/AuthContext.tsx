// eventos-app/src/auth/AuthContext.tsx

import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Permission, permissionsByRole, RBACUser, Role } from './permissions';

type AuthContextValue = {
  currentUser: RBACUser | null;
  loading: boolean;
  setUserById: (idUsuario: number) => Promise<void>;
  can: (p: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY_USER_ID = 'rbac_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<RBACUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedId = await SecureStore.getItemAsync(STORAGE_KEY_USER_ID);
        if (!savedId) {
          setLoading(false);
          return;
        }
        const id = Number(savedId);
        await internalLoadUser(id);
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function internalLoadUser(idUsuario: number) {
    // tu back: GET /users/:id
    const apiUser = await api.getUser(idUsuario);
    // esperamos { id_usuario, nombre_usuario, rol }
    const role: Role = (apiUser.rol as Role) ?? 'USER';

    const mapped: RBACUser = {
      id: apiUser.id_usuario,
      name: apiUser.nombre_usuario,
      role,
      permissions: permissionsByRole[role],
    };

    setCurrentUser(mapped);
  }

  async function setUserById(idUsuario: number) {
    await SecureStore.setItemAsync(STORAGE_KEY_USER_ID, String(idUsuario));
    await internalLoadUser(idUsuario);
  }

  function can(permissionCode: Permission) {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permissionCode);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, setUserById, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
