import { Column, Entity, ManyToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'coment' })
export class ComentEntity extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.coment, { onDelete: "CASCADE" })
  task: TaskEntity;

  @Column({ type: 'int' })
  useId: number;

  @ManyToOne(() => UserEntity, user => user.coment, { onDelete: 'CASCADE' })
  user: UserEntity;
}