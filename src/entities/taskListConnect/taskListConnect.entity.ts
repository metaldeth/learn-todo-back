import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";
import { TaskListEntity } from "../taskList/taskList.entity";

@Entity({ name: 'TaskListConnect' })
export class TaskListConnectEntity {
  @PrimaryColumn({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.connect, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @PrimaryColumn({ type: 'int' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, (taskList) => taskList.connect, { onDelete: 'CASCADE' })
  taskList: TaskListEntity;
}