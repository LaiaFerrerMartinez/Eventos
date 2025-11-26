const BASE = 'http://10.0.2.2:3000';
async function http(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const api = {
  listEvents: (q?: string, category?: number, page=1, limit=10) =>
    http(`/items?page=${page}&limit=${limit}${q?`&q=${encodeURIComponent(q)}`:''}${category?`&category=${category}`:''}`),
  getEvent: (id: number) => http(`/items/${id}`),
  getUser: (id: number) => http(`/users/${id}?t=${Date.now()}`),
  listCategories: () => http(`/categories`),
  createEvent: (payload: any) => http(`/items`, { method: 'POST', body: JSON.stringify(payload) }),
   favoritesOf: (userId: number) => http(`/users/${userId}/favorites`),
  addFavorite: (eventId: number) => http(`/favorites/${eventId}`, { method: 'POST' }),
  removeFavorite: (eventId: number) => http(`/favorites/${eventId}`, { method: 'DELETE' }),

  presign: (fileName: string, contentType: string, userId: string) =>
    http(`/uploads/presign`, { method: 'POST', body: JSON.stringify({ fileName, contentType, userId }) }),
  getPresign: async (fileName: string) => {
    const res = await fetch('http://10.0.2.2:3000/uploads/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        contentType: 'image/jpeg',
        userId: '1', // Si tu backend espera el id así
      }),
    });
    if (!res.ok) {
      console.log('Presign status:', res.status, 'text:', await res.text());
      throw new Error('No se pudo obtener presign');
    }
    return await res.json();
  },
};

