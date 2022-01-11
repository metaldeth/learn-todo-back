import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskDescriptionEntity } from "src/entities/taskDescription/taskDescription.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";
import { CreateTaskListConnectDTO, TaskListConnectDTO } from "../dto/taskListConnect";

export type EditTaskRes = {
  taskId: number,
  data: EditTaskDTO,
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskListConnectEntity)
    private repository: Repository<TaskListConnectEntity>,
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ){}

  public async createTestConnectOnlyTask(data: CreateTaskListConnectDTO): Promise<TaskListConnectDTO> {
    const task = await this.taskRepository.findOne(data.taskId);
    if(!task) throw new NotFoundException();

    const createdConnect = await this.repository.save({
      task
    })

    return {
      taskId: createdConnect.taskId,
      taskListId: createdConnect.taskListId
    }
  }
}