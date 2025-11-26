import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(@InjectRepository(Categoria) private readonly repo: Repository<Categoria>) {}

  create(dto: CreateCategoriaDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }
}
