import { Column, Entity, ManyToOne, PrimaryColumn, Unique, Index, JoinColumn } from "typeorm";
import { TaskEntity } from "../task/task.entity";
import { TaskListEntity } from "../taskList/taskList.entity";

@Entity({ name: 'TaskListConnect' })
export class TaskListConnectEntity {
  @Column({ type: 'boolean', default: 'false' })
  isArchived: boolean;

  @Column({ type: 'boolean', default: 'false' })
  isComplete: boolean;

  @PrimaryColumn({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.listOfTaskListConnect, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  task: TaskEntity;

  @PrimaryColumn({ type: 'int' })
  taskListId: number;

  @ManyToOne(() => TaskListEntity, (taskList) => taskList.listOfUserConnect, { onDelete: 'CASCADE', primary: true })
  @JoinColumn()
  taskList: TaskListEntity;
}