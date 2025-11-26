import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Evento } from '../eventos/entities/evento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorito, Usuario, Evento]),
  ],
  providers: [FavoritosService],
  controllers: [FavoritosController],
  exports: [FavoritosService],
})
export class FavoritosModule {}
