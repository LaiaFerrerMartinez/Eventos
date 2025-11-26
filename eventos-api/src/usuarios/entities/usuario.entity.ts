import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Evento } from '../../eventos/entities/evento.entity';
import { Favorito } from '../../favoritos/entities/favorito.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 100 })
  nombre_usuario: string;

  @OneToMany(() => Evento, (e) => e.usuario)
  eventos: Evento[];

  @OneToMany(() => Favorito, (f) => f.usuario)
  favoritos: Favorito[];
}
