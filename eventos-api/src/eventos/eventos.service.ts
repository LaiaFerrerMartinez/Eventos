import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dtos/create-evento.dto';
import { UpdateEventoDto } from './dtos/update-evento.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

function parseFechaDDMMYYYY(s: string): Date {
  const [dd, mm, yyyy] = s.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd);
}
function isYoutube(url: string) {
  return /(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/i.test(url);
}

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento) private readonly repo: Repository<Evento>,
    @InjectRepository(Usuario) private readonly users: Repository<Usuario>,
    @InjectRepository(Categoria) private readonly cats: Repository<Categoria>,
  ) {}

  async findAll(params: {
    page?: number; limit?: number; q?: string;
    category?: number; min?: number; max?: number;
    sort?: 'fecha'|'puntuacion'|'nombre'; order?: 'ASC'|'DESC';
  }) {
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(params.limit ?? 10)));
    const qb = this.repo.createQueryBuilder('e')
      .leftJoinAndSelect('e.categorias', 'c')
      .leftJoinAndSelect('e.usuario', 'u');

    if (params.q) {
      qb.andWhere('(e.nombre ILIKE :q OR e.descripcion ILIKE :q)', { q: `%${params.q}%` });
    }
    if (params.category) {
      qb.andWhere('c.id_categoria = :cid', { cid: params.category });
    }
    if (params.min != null) qb.andWhere('e.puntuacion >= :min', { min: params.min });
    if (params.max != null) qb.andWhere('e.puntuacion <= :max', { max: params.max });

    const sort = params.sort ?? 'fecha';
    const order = params.order ?? 'DESC';
    qb.orderBy(`e.${sort}`, order as any)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id }, relations: ['categorias', 'usuario'] });
    if (!item) throw new NotFoundException('Evento no encontrado');
    return item;
  }

  async create(dto: CreateEventoDto) {
    if (!isYoutube(dto.video)) throw new BadRequestException('video debe ser URL de YouTube');
    const usuario = await this.users.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new BadRequestException('id_usuario no existe');

    const categorias = await this.cats.find({ where: { id_categoria: In(dto.categorias) } });
    if (categorias.length !== dto.categorias.length) {
      throw new BadRequestException('Alguna categoría no existe');
    }

    const evento = this.repo.create({
      nombre: dto.nombre,
      puntuacion: dto.puntuacion,
      descripcion: dto.descripcion,
      fecha: parseFechaDDMMYYYY(dto.fecha),
      video: dto.video,
      img_evento: dto.img_evento, // S3 key
      usuario,
      categorias,
    });
    return this.repo.save(evento);
  }

  async update(id: number, dto: UpdateEventoDto) {
    const item = await this.findOne(id);
    if (dto.video && !isYoutube(dto.video)) throw new BadRequestException('video debe ser URL de YouTube');
    if (dto.categorias) {
      const cats = await this.cats.find({ where: { id_categoria: In(dto.categorias) } });
      if (cats.length !== dto.categorias.length) throw new BadRequestException('Alguna categoría no existe');
      (item as any).categorias = cats;
    }
    if (dto.id_usuario) {
      const u = await this.users.findOne({ where: { id_usuario: dto.id_usuario } });
      if (!u) throw new BadRequestException('id_usuario no existe');
      (item as any).usuario = u;
    }
    Object.assign(item, {
      nombre: dto.nombre ?? item.nombre,
      puntuacion: dto.puntuacion ?? item.puntuacion,
      descripcion: dto.descripcion ?? item.descripcion,
      fecha: dto.fecha ? parseFechaDDMMYYYY(dto.fecha) : item.fecha,
      video: dto.video ?? item.video,
      img_evento: dto.img_evento ?? item.img_evento,
    });
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { deleted: true };
  }
}
