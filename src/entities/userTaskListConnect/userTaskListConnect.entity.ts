import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { TaskListEntity } from "../taskList/taskList.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'userTaskListConnect' })
@Unique('index', ['taskListId', 'userId'])
export class UserTaskListConnectEntity{
  @Column({ type: 'bool' })
  isOwner: boolean;

  @Column({ name: 'user_Id' })
  userId: number;

  @ManyToOne(() => UserEntity, user => user.taskListConnect, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ name: 'task_List_Id' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, taskList => taskList.userConnect, { onDelete: 'CASCADE' })
  taskList: TaskListEntity;
}