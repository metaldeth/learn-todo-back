import { Column, Entity, ManyToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";
import { TaskListEntity } from "../taskList/taskList.entity";

@Entity({ name: 'TaskListConnect' })
export class TaskListConnectEntity extends BasicEntity {
  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.connect, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @Column({ type: 'int' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, (taskList) => taskList.connect, { onDelete: 'CASCADE' })
  taskList: TaskListEntity;
}