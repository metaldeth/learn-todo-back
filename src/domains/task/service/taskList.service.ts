import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { UserTaskListConnectEntity } from "src/entities/userTaskListConnect/userTaskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from "../dto/taskList";

export type EditTaskListRes = {
  taskListId: number,
  data: EditTaskListDTO,
}

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private repository: Repository<TaskListEntity>,
    @InjectRepository(TaskListConnectEntity)
    private connectTaskRepository: Repository<TaskListConnectEntity>,
    @InjectRepository(UserTaskListConnectEntity)
    private connectUserRepository: Repository<UserTaskListConnectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){}

  public async checkAccess(taskListId: number): Promise<boolean> {
    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException(); 
    return !!taskList; //todo
  }

  public async fetchListOfTaskList(): Promise<TaskListDTO[]> {
    const listOfTaskList = await this.repository.find({
      where: { isArchived: false },
      // relations: ['taskList'],
      order: { created_at: 'ASC' }
    });

    return listOfTaskList.map(taskList => ({
      id: taskList.id,
      caption: taskList.caption,
      listOfMember: taskList.userConnect.map(connect => ({
        id: connect.userId,
        isOwner: connect.isOwner,
        name: connect.user.name,
      }))
    }))
  }

  public async fetchListOFTaskListByTask(taskId: number): Promise<TaskListDTO[]> {
    const listOfConnect = await this.connectTaskRepository.find({
      where: { taskId },
      order: { taskListId: 'ASC' }
    });

    listOfTaskList.map(taskList => ({
      id: taskList.id,
      caption: taskList.caption,
      listOfMember: taskList.userConnect.map(connect => ({
        id: connect.userId,
        isOwner: connect.isOwner,
        name: connect.user.name,
      }))
    }))
  }

  public async fetchListOfTaskListByUserId(userId: number): Promise<TaskListDTO[]> {
    const listOf
  }

  public async createTaskList(data: CreateTaskListDTO): Promise<TaskListDTO> {
    const createdTaskList = await this.repository.save(data);

    return{
      id: createdTaskList.id,
      caption: createdTaskList.caption,
    };
  }

  public async editTaskList(dataRes: EditTaskListRes): Promise<TaskListDTO> {
    const { data, taskListId } = dataRes;

    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    taskList.caption = data.caption;

    const updatedTaskList = await this.repository.save(taskList);

    return{
      id: updatedTaskList.id,
      caption: updatedTaskList.caption,
    };
  }

  public async removeTaskList(taskListId: number): Promise<void> {
    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    taskList.isArchived = true;

    await this.repository.save(taskList);
  }
}