import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { TaskEntity } from "../task/task.entity";
import { TaskListEntity } from "../taskList/taskList.entity";

@Entity({ name: 'TaskListConnect' })
@Unique('index', ['taskListId', 'taskId'])
export class TaskListConnectEntity {
  @Column({ name: 'task_Id' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.connect, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @Column({ name: 'task_List_Id' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, (taskList) => taskList.connect, { onDelete: 'CASCADE' })
  taskList: TaskListEntity;
}