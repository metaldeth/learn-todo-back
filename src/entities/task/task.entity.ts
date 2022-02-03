import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BasicEntity } from "../base.entity";
import { CommentEntity } from "../comment/comment.entity";
import { TaskListConnectEntity } from "../taskListConnect/taskListConnect.entity";

@Entity({ name: 'task' })
export class TaskEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @OneToMany(() => CommentEntity, (coment) => coment.task, { onDelete: 'CASCADE' })
    listOfComment: CommentEntity[];

    @ManyToOne(() => TaskListConnectEntity, (connect) => connect.task, { onDelete: 'CASCADE' })
    listOfTaskListConnect: TaskListConnectEntity[];
}