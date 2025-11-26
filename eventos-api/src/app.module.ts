import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EventosModule } from './eventos/eventos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    DatabaseModule,
    UsuariosModule,
    EventosModule,
    CategoriasModule,
    FavoritosModule,
    UploadsModule,
  ],
})
export class AppModule {}
