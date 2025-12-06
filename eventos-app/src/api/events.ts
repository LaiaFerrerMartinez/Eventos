// eventos-app/src/api/events.ts

import { api } from './client';

export type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  puntuacion: number;
  fecha: string;
  video?: string;
  img_evento?: string;
  img_evento_url?: string;
  categorias?: { id_categoria: number; nombre: string; img_categoria?: string }[];
  activo?: boolean;
};

export async function listEvents(): Promise<Evento[]> {
  const res = await api.listEvents(); // ya lo tienes definido en client
  return res.data;
}

export async function getEvent(id: number): Promise<Evento> {
  const res = await api.getEvent(id); // igual que usas en el resto
  return res.data;
}

// De momento NO definimos update aquí para evitar el error de patch.
// Puedes seguir usando api.put('/eventos/:id', ...) directamente donde lo necesites.
