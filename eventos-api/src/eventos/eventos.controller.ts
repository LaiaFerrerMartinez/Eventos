import { Controller, Get, Post, Param, Body, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dtos/create-evento.dto';
import { UpdateEventoDto } from './dtos/update-evento.dto';

@ApiTags('items')
@Controller('items')
export class EventosController {
  constructor(private readonly service: EventosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos con filtros y paginación' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
    @Query('category') category?: number,
    @Query('min') min?: number,
    @Query('max') max?: number,
    @Query('sort') sort?: any,
    @Query('order') order?: any,
  ) {
    return this.service.findAll({ page, limit, q, category, min, max, sort, order });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de evento' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear evento (requiere img_evento S3 key y URL YouTube)' })
  create(@Body() dto: CreateEventoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evento' })
  update(@Param('id') id: number, @Body() dto: UpdateEventoDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evento' })
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
