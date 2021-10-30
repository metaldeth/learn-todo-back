import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { ComentEntity } from "../coment/coment.entity";
import { TaskDescriptionEntity } from "../taskDescription/taskDescription.entity";
import { TaskListEntity } from "../taskList/taskList.entity";
import { TaskListConnectEntity } from "../taskListConnect/taskListConnect.entity";

@Entity({ name: 'task' })
export class TaskEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @OneToMany(() => ComentEntity, (coment) => coment.task, { onDelete: 'CASCADE' })
    coment: ComentEntity[];

    @Column({ type: 'int' })
    taskDescriptionId: number;

    @OneToOne(() => TaskDescriptionEntity, (taskDescription) => taskDescription.task, { onDelete: 'CASCADE' })
    taskDescription: TaskDescriptionEntity;

    @ManyToOne(() => TaskListConnectEntity, (connect) => connect.task, { onDelete: 'CASCADE' })
    connect: TaskListConnectEntity[];
}