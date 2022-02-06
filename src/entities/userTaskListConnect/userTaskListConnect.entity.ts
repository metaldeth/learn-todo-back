import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";
import { TaskListEntity } from "../taskList/taskList.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'userTaskListConnect' })
export class UserTaskListConnectEntity{
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, user => user.listOfTaskList, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  user: UserEntity;

  @PrimaryColumn({ type: 'int' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, taskList => taskList.listOfUserConnect, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  taskList: TaskListEntity;

  @Column({ type: 'boolean' })
  isOwner: boolean;

  @Column({ type: 'boolean', default: 'false' })
  isArchived: boolean;

  @Column({ type: 'boolean', default: 'false' })
  isFavorite: boolean;
}