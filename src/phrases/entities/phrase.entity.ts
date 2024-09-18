import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Phrase {
  /* llave primaria */
  @PrimaryGeneratedColumn()
  ID: number;

  /////LLAVE FORANEA DE LA TABLA PHRASES typeorm la genera automaticamente
  @ManyToOne(() => Category, (category) => category.phrases)
  @JoinColumn({ name: 'CATEGORIAID' }) ////nombre de la llave foranea
  category: Category;

  @Column({ type: 'varchar', length: 254 })
  FRASE: string;

  @Column({ type: 'varchar', length: 254 })
  AUTOR: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  ////relaciones muchos a muchos
  @ManyToMany(() => User, (user) => user.favoritePhrases)
  usersFavorited: User[]; ////nombre a llamar a la tabla de la relación

  ////relaciones muchos a muchos
  @ManyToMany(() => User, (user) => user.dislikePhrases)
  usersDislikePhrases: User[]; ////nombre a llamar a la tabla de la relación

  @Column({ type: 'varchar', length: 254, nullable: true })
  extra_data1: string;

  @Column({ type: 'varchar', length: 254, nullable: true })
  extra_data2: string;
}
