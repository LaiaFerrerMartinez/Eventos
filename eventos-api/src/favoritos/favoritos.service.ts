import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { Evento } from '../eventos/entities/evento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito) private readonly repo: Repository<Favorito>,
    @InjectRepository(Evento) private readonly eventos: Repository<Evento>,
    @InjectRepository(Usuario) private readonly users: Repository<Usuario>,
  ) {}

  async add(userId: number, eventoId: number) {
    const u = await this.users.findOne({ where: { id_usuario: userId } });
    const e = await this.eventos.findOne({ where: { id: eventoId } });
    if (!u || !e) throw new NotFoundException('Usuario o Evento no existe');
    const fav = this.repo.create({ id_usuario: userId, id_evento: eventoId, usuario: u, evento: e });
    return this.repo.save(fav);
  }

  async remove(userId: number, eventoId: number) {
    await this.repo.delete({ id_usuario: userId, id_evento: eventoId });
    return { deleted: true };
  }

  async list(userId: number) {
    return this.repo.find({ where: { id_usuario: userId }, relations: ['evento'] });
  }
}
