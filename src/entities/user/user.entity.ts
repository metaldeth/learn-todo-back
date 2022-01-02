import { Column, Entity, OneToMany } from "typeorm";
import { BasicEntity } from "../base.entity";
import { ComentEntity } from "../coment/coment.entity";

@Entity({ name: 'user' })
export class UserEntity extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => ComentEntity, coment => coment.user, { onDelete: 'CASCADE' })
  coment: ComentEntity[];
}