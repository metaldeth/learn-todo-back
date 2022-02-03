import { Column, Entity, OneToMany } from "typeorm";
import { BasicEntity } from "../base.entity";
import { CommentEntity } from "../comment/comment.entity";
import { UserTaskListConnectEntity } from "../userTaskListConnect/userTaskListConnect.entity";

@Entity({ name: 'user' })
export class UserEntity extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => CommentEntity, coment => coment.user, { onDelete: 'CASCADE' })
  listOfComment: CommentEntity[];

  @OneToMany(() => UserTaskListConnectEntity, taskListConnect => taskListConnect.user, { onDelete: 'CASCADE' })
  listOfTaskList: UserTaskListConnectEntity[]
}