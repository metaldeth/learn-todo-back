import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "src/entities/comment/comment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { UserTaskListConnectEntity } from "src/entities/userTaskListConnect/userTaskListConnect.entity";
import { 
  TaskController, 
  TaskListController 
} from "./controllers";
import { 
  TaskListService, 
  TaskService 
} from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    TaskListEntity,
    TaskListConnectEntity,
    CommentEntity,
    UserEntity,
    UserTaskListConnectEntity,
  ])],
  providers: [
    TaskListService,
    TaskService,
  ],
  controllers: [
    TaskListController,
    TaskController,
  ],
})

export class TaskModule {}