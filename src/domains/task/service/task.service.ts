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
    const listOfTask = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' },
    })

    const mapOfTask: Record<number, TaskDTO> = {};

    listOfTask.forEach(task => mapOfTask[task.id] = task);

    const listOfConnect = await this.connectRepository.find({
      where: { taskListId },
      order: { taskId: 'ASC' }
    });

    return listOfConnect.map(item => ({
      id: item.taskId,
      caption: mapOfTask[item.taskId].caption,
      description: mapOfTask[item.taskId].description,
    }));
  }

  public async createTask(data: CreateTaskDTO, taskListId: number): Promise<TaskDTO> {
    const taskList = await this.taskListRepository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    const createdTask = await this.repository.save({
      caption: data.caption,
      description: data.description,
    });

    // const createtedTaskListConnect = await this.connectRepository.save({
    //   taskList,
    //   task: createdTask,
    //   isArchived: false,
    // })

    return{
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTask.caption,
      // listOfTaskListId: [
      //   createtedTaskListConnect.taskListId
      // ]
    };
  }

  public async editTask(dataRes: EditTaskRes): Promise<TaskDTO> {
    const { data, taskId } = dataRes;

    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.caption = data.caption;
    task.description = data.description;

    const updatedTask = await this.repository.save(task);

    // const listOfConnect = await this.connectRepository.find({
    //   where: { isArchived: false, taskId: task.id },
    //   order: { taskListId: 'ASC' }
    // })

    return{
      id: updatedTask.id,
      caption: updatedTask.caption,
      description: updatedTask.description,
      // listOfTaskListId: listOfConnect.map(connect => connect.taskListId),
    };
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.isArchived = true;

    await this.repository.save(task);
  }
}