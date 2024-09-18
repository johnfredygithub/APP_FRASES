import { Exclude } from 'class-transformer';
import { Phrase } from '../../phrases/entities/phrase.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  /* LLAVE PRIMARIA */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Exclude() //////EXCLUIR LA PASSWORD DE CUALQUIER REPUESTA DE EL SERVER
  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  recovery_token: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  ///////columnas estra en caso de necesitar mas campos
  @Column({ type: 'varchar', length: 150, nullable: true })
  rol: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  extra_data2: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  extra_data3: string | null;

  /////columna SOLO disponble en postgres>=9.2(MSSQL SOPORTA DESDE LA VERSION 2016- MYSQL>versión 5.7  )
  /* @Column({ type: 'json', length: 50 })
  doc_jsondata: string; */

  ///////relaciones
  @ManyToMany(() => Phrase, (phrase) => phrase.usersFavorited)
  @JoinTable({
    name: 'favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'phrase_id',
      referencedColumnName: 'ID',
    },
  })
  favoritePhrases: Phrase[]; ////nombre a llmar en la tabla de la relacion

  ///////dislikes
  @ManyToMany(() => Phrase, (phrase) => phrase.usersDislikePhrases)
  @JoinTable({
    name: 'dislike_phrases',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'phrase_id',
      referencedColumnName: 'ID',
    },
  })
  dislikePhrases: Phrase[]; ////nombre a llmar en la tabla de la relacion
}
