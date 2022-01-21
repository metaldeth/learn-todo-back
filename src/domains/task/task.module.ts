import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComentEntity } from "src/entities/coment/coment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { UserTaskListConnectEntity } from "src/entities/userTaskListConnect/userTaskListConnect.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    TaskListEntity,
    TaskListConnectEntity,
    ComentEntity,
    UserEntity,
    UserTaskListConnectEntity,
  ])],
  providers: [
  ],
  controllers: [
  ],
})

export class TaskModule {}