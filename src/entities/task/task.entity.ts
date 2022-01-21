import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { ComentEntity } from "../coment/coment.entity";
import { TaskListConnectEntity } from "../taskListConnect/taskListConnect.entity";

@Entity({ name: 'task' })
export class TaskEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @OneToMany(() => ComentEntity, (coment) => coment.task, { onDelete: 'CASCADE' })
    coment: ComentEntity[];

    @ManyToOne(() => TaskListConnectEntity, (connect) => connect.task, { onDelete: 'CASCADE' })
    connect: TaskListConnectEntity[];
}