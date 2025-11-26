import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritosService } from './favoritos.service';

@ApiTags('favorites')
@Controller()
export class FavoritosController {
  constructor(private readonly s: FavoritosService) {}

  @Get('users/:id/favorites')
  @ApiOperation({ summary: 'Listar favoritos de un usuario' })
  list(@Param('id') id: string) {
    return this.s.list(Number(id));
  }

  @Post('favorites/:itemId')
  @ApiOperation({ summary: 'Añadir favorito (usuario demo=1)' })
  add(@Param('itemId') itemId: string) {
    const user = 1; // en producción, obtener del auth token
    return this.s.add(user, Number(itemId));
  }

  @Delete('favorites/:itemId')
  @ApiOperation({ summary: 'Eliminar favorito (usuario demo=1)' })
  del(@Param('itemId') itemId: string) {
    const user = 1;
    return this.s.remove(user, Number(itemId));
  }
}
