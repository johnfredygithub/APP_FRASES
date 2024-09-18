import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Phrase } from './phrase.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  nombre: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;
  //////relation one to many una frase solo puede pertenecer a una categoria
  @OneToMany(() => Phrase, (phrase) => phrase.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  phrases: Phrase[];
}
