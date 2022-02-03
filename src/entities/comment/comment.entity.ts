import { Column, Entity, ManyToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'comment' })
export class CommentEntity extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.listOfTaskListConnect, { onDelete: "CASCADE" })
  task: TaskEntity;

  @Column({ type: 'int' })
  useId: number;

  @ManyToOne(() => UserEntity, user => user.listOfComment, { onDelete: 'CASCADE' })
  user: UserEntity;
}