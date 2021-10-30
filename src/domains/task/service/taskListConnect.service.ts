import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskListConnectDTO, TaskListConnectDTO } from "../dto/taskListConnect";

@Injectable()
export class TaskListConnectService {
  constructor(
    @InjectRepository(TaskListConnectEntity)
    private repository: Repository<TaskListConnectEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ){}

  public async getListOfTaskListConnect(): Promise<TaskListConnectDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return list.map(item => ({
      id: item.id,
      taskId: item.taskId,
      taskListId: item.taskListId
    }));
  }

  public async getListOfTaskListConnectByTaskId(taskId: number): Promise<TaskListConnectDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false, taskId },
      order: { created_at: 'ASC' }
    });

    return list.map(item => ({
      id: item.id,
      taskId: item.taskId,
      taskListId: item.taskListId,
    }));
  }

  public async getListOfTaskListConnectByTaskListId(taskListId: number): Promise<TaskListConnectDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false, taskListId },
      order: { created_at: 'ASC' }
    });

    return list.map(item => ({
      id: item.id,
      taskId: item.taskId,
      taskListId: item.taskListId,
    }));
  }


  public async createTaskListConnect(data: CreateTaskListConnectDTO): Promise<TaskListConnectDTO> {
    const { taskId, taskListId } = data;

    const task = await this.taskRepository.findOne(taskId);
    const taskList = await this.taskListRepository.findOne(taskListId);

    const createdTaskListConnect = await this.repository.save({
      task,
      taskList
    })

    return ({
      id: createdTaskListConnect.id,
      taskId: createdTaskListConnect.taskId,
      taskListId: createdTaskListConnect.taskListId
    })
  }

  public async removeTaskListConnect(connectId: number): Promise<void> {
    const connect = await this.repository.findOne(connectId);

    if(!connect) throw new NotFoundException();

    connect.isArchived = true;

    await this.repository.save(connect);
  }
}