import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Favorito } from '../../favoritos/entities/favorito.entity';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'puntuacion', type: 'int', default: 0 })
  puntuacion: number;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fecha', type: 'date' })
  fecha: Date;

  @Column({ name: 'video', type: 'varchar', length: 255 })
  video: string;

  @Column({ name: 'img_evento', type: 'varchar', length: 255 })
  img_evento: string; // S3 key

  @ManyToOne(() => Usuario, (u) => u.eventos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToMany(() => Categoria, (c) => c.eventos, { cascade: false })
  @JoinTable({
    name: 'eventos_categorias',
    joinColumn: { name: 'id_evento', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_categoria', referencedColumnName: 'id_categoria' },
  })
  categorias: Categoria[];

  @OneToMany(() => Favorito, (f) => f.evento)
  favoritos: Favorito[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
