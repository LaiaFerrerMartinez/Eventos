import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';

@ApiTags('users')
@Controller('users')
export class UsuariosController {
  constructor(private readonly s: UsuariosService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  findOne(@Param('id') id: string) {
    return this.s.findOne(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  findAll() {
    return this.s.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.s.create(dto);
  }
}
