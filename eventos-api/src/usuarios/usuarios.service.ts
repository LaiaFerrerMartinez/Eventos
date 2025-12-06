// src/usuarios/usuarios.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly repo: Repository<Usuario>,
  ) {}

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(dto: CreateUsuarioDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll() {
    return this.repo.find();
  }

async findByName(nombre: string) {
  const user = await this.repo.findOne({
    where: { nombre_usuario: nombre },
  });
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }
  return user;
}


}
