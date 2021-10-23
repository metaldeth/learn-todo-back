import { Column, Entity, OneToMany } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";

@Entity({ name: 'taskList' })
export class TaskListEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @Column({ type: 'int' })
    taskId: number;

    @OneToMany(() => TaskEntity, (task) => task.taskList, { onDelete: 'CASCADE' })
    task: TaskEntity[];
}