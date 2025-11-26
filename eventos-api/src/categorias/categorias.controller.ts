import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriasController {
  constructor(private readonly s: CategoriasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear categoría' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.s.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorías' })
  findAll() {
    return this.s.findAll();
  }
}
