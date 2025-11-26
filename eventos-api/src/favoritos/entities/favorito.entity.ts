import { Entity, ManyToOne, PrimaryColumn, Unique, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Evento } from '../../eventos/entities/evento.entity';

@Entity('favoritos')
@Unique(['id_usuario', 'id_evento'])
export class Favorito {
  @PrimaryColumn({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_evento', type: 'int' })
  id_evento: number;

  @ManyToOne(() => Usuario, (u) => u.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Evento, (e) => e.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_evento' })
  evento: Evento;
}
