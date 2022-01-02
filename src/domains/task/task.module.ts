import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComentEntity } from "src/entities/coment/coment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskDescriptionEntity } from "src/entities/taskDescription/taskDescription.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    TaskListEntity,
    TaskListConnectEntity,
    TaskDescriptionEntity,
    ComentEntity,
  ])],
  providers: [
  ],
  controllers: [
  ],
})

export class TaskModule {}