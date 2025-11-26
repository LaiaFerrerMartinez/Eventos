import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento } from './entities/evento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento, Usuario, Categoria]),
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}
