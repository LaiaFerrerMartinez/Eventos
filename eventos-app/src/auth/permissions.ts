// eventos-app/src/auth/permissions.ts

export type Role = 'USER' | 'ADMIN';

export type Permission =
  | 'ITEM_LIST'
  | 'ITEM_DETAIL'
  | 'ITEM_CREATE'
  | 'ITEM_EDIT'
  | 'ITEM_DEACTIVATE'
  | 'FAVORITES_USE'
  | 'PROFILE_VIEW'
  | 'PROFILE_EDIT'
  | 'ADMIN_PANEL_VIEW';

export type RBACUser = {
  id: number;
  name: string;
  role: Role;
  permissions: Permission[];
};

export const permissionsByRole: Record<Role, Permission[]> = {
  USER: ['ITEM_LIST', 'ITEM_DETAIL', 'FAVORITES_USE', 'PROFILE_VIEW'],
  ADMIN: [
    'ITEM_LIST',
    'ITEM_DETAIL',
    'ITEM_CREATE',
    'ITEM_EDIT',
    'ITEM_DEACTIVATE',
    'ADMIN_PANEL_VIEW',
    'PROFILE_VIEW',
    'PROFILE_EDIT',
    'FAVORITES_USE',
  ],
};
