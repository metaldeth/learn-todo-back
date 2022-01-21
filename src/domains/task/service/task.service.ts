import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";

export type EditTaskRes = {
  taskId: number,
  data: EditTaskDTO,
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private repository: Repository<TaskEntity>,
    @InjectRepository(TaskListConnectEntity)
    private connectRepository: Repository<TaskListConnectEntity>,
  ){}

  public async checkAccess(taskId: number): Promise<boolean> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException(); 
    return !!task; //todo
  }

  // public async fetchListOfTaskByTaskListId(taskListId: number): Promise<TaskDTO[]> {
  //   const listOfTaskId = await this.listConnectRepository.findOne({
  //     where: { taskListId },
  //     order: { taskId: 'ASC' }
  //   });

  //   const 
  // }

  public async fetchListOfTask(): Promise<TaskDTO[]> {
    const listOfTask = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return listOfTask.map(item => ({
      id: item.id,
      caption: item.caption,
      description: item.description
    }));
  }

  public async fetchListOfTaskByTaskList(taskListId: number): Promise<TaskDTO[]> {
    const listOfConnect = await this.connectRepository.find({
      where: { taskListId },
      order: { taskId: 'ASC' }
    });

    return listOfConnect.map(item => ({
      id: item.task.id,
      caption: item.task.caption,
      description: item.task.description,
    }));
  }

  public async createTask(data: CreateTaskDTO): Promise<TaskDTO> {
    const createdTask = await this.repository.save({
      caption: data.caption,
      description: data.description,
    });

    return{
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTask.caption,
    };
  }

  public async editTask(dataRes: EditTaskRes): Promise<TaskDTO> {
    const { data, taskId } = dataRes;

    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.caption = data.caption;
    task.description = data.description;

    const updatedTask = await this.repository.save(task);

    return{
      id: updatedTask.id,
      caption: updatedTask.caption,
      description: updatedTask.description,
    };
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.isArchived = true;

    await this.repository.save(task);
  }
}