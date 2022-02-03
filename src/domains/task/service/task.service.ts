import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";

export type EditTaskRes = {
  taskId: number,
  data: EditTaskDTO,
  taskListId: number;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private repository: Repository<TaskEntity>,
    @InjectRepository(TaskListConnectEntity)
    private connectRepository: Repository<TaskListConnectEntity>,
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ){}

  public async checkAccess(taskId: number, userId: number): Promise<boolean> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException(); 
    return !!task; //todo
  }

  // public async fetchListOfTask(): Promise<TaskDTO[]> {
  //   const listOfTask = await this.repository.find({
  //     where: { isArchived: false },
  //     order: { created_at: 'ASC' }
  //   });

  //   return listOfTask.map(item => ({
  //     id: item.id,
  //     caption: item.caption,
  //     description: item.description
  //   }));
  // }

  public async fetchListOfTaskByTaskListId(taskListId: number): Promise<TaskDTO[]> {
    const listOfConnect = await this.connectRepository.find({
      where: { taskListId, isArchived: false },
      order: { taskId: 'ASC' },
      relations: [ 'task' ],
    });

    return listOfConnect.map(connect => ({
      id: connect.task.id,
      caption: connect.task.caption,
      description: connect.task.description,
      isComplete: connect.isComplete
    }));
  }

  public async createTask(data: CreateTaskDTO, taskListId: number): Promise<TaskDTO> {
    const taskList = await this.taskListRepository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    const createdTask = await this.repository.save({
      caption: data.caption,
      description: data.description,
    });

    const connect = await this.connectRepository.save({
      taskList,
      task: createdTask,
      isArchived: false,
    })

    return{
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTask.description,
      isComplete: connect.isArchived,
    };
  }

  public async editTask(dataRes: EditTaskRes): Promise<TaskDTO> {
    const { data, taskId, taskListId } = dataRes;

    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const connect = await this.connectRepository.findOne({ taskId, taskListId });
    if(!connect) throw new NotFoundException();

    task.caption = data.caption;
    task.description = data.description;
    connect.isComplete = data.isComplete;

    const updatedTask = await this.repository.save(task);
    const updatedConnect = await this.connectRepository.save(connect);


    return{
      id: updatedTask.id,
      caption: updatedTask.caption,
      description: updatedTask.description,
      isComplete: updatedConnect.isComplete,
    };
  }

  public async removeOneTask(taskId: number, taskListId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const taskList = await this.taskListRepository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    const connect = await this.connectRepository.findOne({ taskId, taskListId })
    if(!connect) throw new NotFoundException();

    connect.isArchived = true;

    await this.connectRepository.save(connect);

    const listOfConnect = await this.connectRepository.find({
      where: { taskId, isArchived: false },
      order: { taskListId: 'ASC' }
    })

    !listOfConnect.length && (task.isArchived = true);
    
    await this.repository.save(task);
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const listOfConnect = await this.connectRepository.find({
      where: { taskId, isArchived: false },
      order: { taskListId: 'ASC' }
    });

    const listOfConnectPromise = listOfConnect.map(connect => {
      connect.isArchived = true;
      return this.connectRepository.save(connect);
    })

    await Promise.all(listOfConnectPromise);

    task.isArchived = true;

    await this.repository.save(task);
  }
}