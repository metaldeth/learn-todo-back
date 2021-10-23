import { Column, Entity, ManyToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskListEntity } from "../taskList/taskList.entity";

@Entity({ name: 'task' })
export class TaskEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'int' })
    taskListId: number;

    @ManyToOne(() => TaskListEntity, (taskList) => taskList.task, { onDelete: 'CASCADE' })
    taskList;
}