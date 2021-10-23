import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskController, TaskListController } from "./controllers";
import { TaskListService, TaskService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    TaskListEntity
  ])],
  providers: [
    TaskService,
    TaskListService
  ],
  controllers: [
    TaskController,
    TaskListController
  ],
})

export class TaskModule {}