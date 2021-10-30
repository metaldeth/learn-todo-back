import { Column, Entity, OneToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";

@Entity({ name: 'TaskDescription' })
export class TaskDescriptionEntity extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @OneToOne(() => TaskEntity, (task) => task.taskDescription, { onDelete: 'CASCADE' })
  task: TaskEntity;
}