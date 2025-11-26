import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Evento } from '../eventos/entities/evento.entity';

// Carga variables de entorno si ejecutas fuera de Nest
import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'prod' ? '.prod.env' : process.env.NODE_ENV === 'stg' ? '.stg.env' : '.env' });

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const ds = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Usuario, Categoria, Evento],
  ssl: { rejectUnauthorized: false },
  // logging: true,
});

async function run() {
  await ds.initialize();

  const uRepo = ds.getRepository(Usuario);
  const cRepo = ds.getRepository(Categoria);
  const eRepo = ds.getRepository(Evento);

  // Limpieza opcional (cuidado en entornos compartidos)
  // await eRepo.delete({});
  // await cRepo.delete({});
  // await uRepo.delete({});

  // 1) Usuarios (10)
  const usuarios: Usuario[] = await uRepo.save(
    Array.from({ length: 10 }).map((_, i) => uRepo.create({ nombre_usuario: `user${i + 1}` })),
  );

  if (usuarios.length === 0) throw new Error('No se pudieron crear usuarios');

  // 2) Categorías (puedes cambiarlas libremente)
  const catNames = [
    'Conferencias',
    'Talleres',
    'Meetups',
    'Webinars',
    'Bootcamps',
    'Hackathons',
    'Keynotes',
    'Networking',
    'Startups',
    'IA',
    'Cloud',
    'DevOps',
  ];
  const categorias: Categoria[] = await cRepo.save(
    catNames.map((n) => cRepo.create({ nombre_categoria: n, img_categoria: `icons/${n.toLowerCase()}.png` })),
  );

  if (categorias.length === 0) throw new Error('No se pudieron crear categorías');

  // 3) Eventos (30)
  const videos = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
  ];

  const eventos: Evento[] = []; // TIPADO CORRECTO

  for (let i = 1; i <= 30; i++) {
    const usuario = rand(usuarios);
    const pick = Array.from(new Set([rand(categorias), rand(categorias), rand(categorias)]));
    const cats = pick.slice(0, 2);

    const ev = eRepo.create({
      nombre: `Evento ${i}`,
      puntuacion: Math.floor(Math.random() * 6), // 0..5
      descripcion: `Descripción del evento ${i}`,
      fecha: new Date(2025, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28)),
      video: rand(videos),
      img_evento: `seed/images/evento-${i}.jpg`, // o key real de S3
      usuario,         // ENTIDAD completa
      categorias: cats // ENTIDADES completas
    });

    eventos.push(ev); // NO DEBE FALLAR si eventos es Evento[]
  }

  await eRepo.save(eventos);

  console.log(`Seed OK: usuarios=${usuarios.length}, categorias=${categorias.length}, eventos=${eventos.length}`);
  await ds.destroy();
}

run().catch((err) => {
  console.error('Seed ERROR:', err);
  process.exit(1);
});
