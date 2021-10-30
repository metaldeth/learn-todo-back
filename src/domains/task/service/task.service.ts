import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskDescriptionEntity } from "src/entities/taskDescription/taskDescription.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";

type CreateTaskRes = {
  taskDTO: CreateTaskDTO,
  taskListId: number,
}

type EditTaskRes = {
  taskDTO: EditTaskDTO,
  taskId: number,
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private repository: Repository<TaskEntity>,
    @InjectRepository(TaskDescriptionEntity)
    private descriptionReposiroty: Repository<TaskDescriptionEntity>,
    @InjectRepository(TaskListConnectEntity)
    private connectRepository: Repository<TaskListConnectEntity>,
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ){}


  public async chechAccess (taskId: number): Promise<boolean> {
    const task = await this.repository.findOne(taskId);

    if(!task) throw new NotFoundException();

    return !!task;
  }

  public async getListOfTask (): Promise<TaskDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return list.map(item => ({
      id: item.id,
      caption: item.caption,
      description: item.taskDescription.caption,
    }));
  }

  public async getListOfTaskByTaskListId (taskListId: number): Promise<TaskDTO[]> {
    const connectList = await this.connectRepository.find({
      where: { isArchived: false, taskListId },
      order: { created_at: 'ASC' }
    });

    const taskList = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    const list: Array<TaskDTO> = [];

    connectList.forEach(connect => {
      const taskIndex = taskList.findIndex(task => task.id === connect.taskId)
      const task = taskList[taskIndex];
      list.push({
        id: task.id,
        caption: task.caption,
        description: task.taskDescription.caption,
      });
    });

    return list
  }

  public async createTask (data: CreateTaskRes): Promise<TaskDTO> {
    const { taskDTO, taskListId } = data;

    const taskData = { caption: taskDTO.caption };
    const taskDescriptionData = { caption: taskDTO.description };

    const taskList = await this.taskListRepository.findOne(taskListId);

    const createdTask = await this.repository.save(taskData);

    const createdTaskDescription = await this.descriptionReposiroty.save({
      task: createdTask,
      caption: taskDescriptionData.caption,
    });

    await this.connectRepository.save({
      task: createdTask,
      taskList
    });

    return ({
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTaskDescription.caption,
    });
  }

  public async updateTask (data: EditTaskRes): Promise<TaskDTO> {
    const { taskDTO, taskId } = data;
    const taskData = { caption: taskDTO.caption };
    const taskDescriptionData = { caption: taskDTO.description };

    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const taskDescription = await this.descriptionReposiroty.findOne(task.taskDescriptionId);
    if(!taskDescription) throw new NotFoundException();

    task.caption = taskData.caption;

    taskDescription.caption = taskDescriptionData.caption;

    const createdTask = await this.repository.save(task);
    const createdTaskDescription = await this.repository.save(taskDescription);

    const createdData: TaskDTO = {
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTaskDescription.caption
    };

    return createdData;
  }

  public async removeTask (taskId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const taskDescription = await this.descriptionReposiroty.findOne(task.taskDescriptionId);
    if(!taskDescription) throw new NotFoundException();

    taskDescription.isArchived = true;
    task.isArchived = true;

    await this.repository.save(task);
    await this.descriptionReposiroty.save(taskDescription);
  }
}