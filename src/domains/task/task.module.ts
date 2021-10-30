import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComentEntity } from "src/entities/coment/coment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskDescriptionEntity } from "src/entities/taskDescription/taskDescription.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { TaskListController } from "./controllers";
import { TaskListService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    TaskListEntity,
    TaskListConnectEntity,
    TaskDescriptionEntity,
    ComentEntity,
  ])],
  providers: [
    TaskListService
  ],
  controllers: [
    TaskListController
  ],
})

export class TaskModule {}