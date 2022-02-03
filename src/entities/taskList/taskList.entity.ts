import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BasicEntity } from "../base.entity";
import { TaskEntity } from "../task/task.entity";
import { TaskListConnectEntity } from "../taskListConnect/taskListConnect.entity";
import { UserTaskListConnectEntity } from "../userTaskListConnect/userTaskListConnect.entity";

@Entity({ name: 'taskList' })
export class TaskListEntity extends BasicEntity {
    @Column({ type: 'varchar', length: 255 })
    caption: string;

    @ManyToOne(() => TaskListConnectEntity, connect => connect.taskList, { onDelete: 'CASCADE' })
    listOfTaskListConnect: TaskListConnectEntity[];

    @ManyToOne(() => UserTaskListConnectEntity, userConnect => userConnect.taskList, { onDelete: 'CASCADE' })
    listOfUserConnect: UserTaskListConnectEntity[];
}