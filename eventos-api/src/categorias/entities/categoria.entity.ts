import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Evento } from '../../eventos/entities/evento.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id_categoria: number;

  @Column({ name: 'nombre_categoria', type: 'varchar', length: 100 })
  nombre_categoria: string;

  @Column({ name: 'img_categoria', type: 'varchar', length: 255, nullable: true })
  img_categoria?: string;

  @ManyToMany(() => Evento, (e) => e.categorias)
  eventos: Evento[];
}
