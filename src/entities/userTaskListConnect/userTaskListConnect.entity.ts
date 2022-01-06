import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";
import { TaskListEntity } from "../taskList/taskList.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'userTaskListConnect' })
export class UserTaskListConnectEntity{
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, user => user.taskListConnect, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  user: UserEntity;

  @PrimaryColumn({ type: 'int' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, taskList => taskList.userConnect, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  taskList: TaskListEntity;

  @Column({ type: 'bool' })
  isOwner: boolean;
}