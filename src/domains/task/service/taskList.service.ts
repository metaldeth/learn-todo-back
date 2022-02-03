import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { TaskListConnectEntity } from "src/entities/taskListConnect/taskListConnect.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { UserTaskListConnectEntity } from "src/entities/userTaskListConnect/userTaskListConnect.entity";
import { Repository } from "typeorm";
import { CreateTaskListDTO, EditTaskListDTO, MemberByTaskList, TaskListDTO } from "../dto/taskList";

export type EditTaskListRes = {
  taskListId: number,
  data: EditTaskListDTO,
}

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private repository: Repository<TaskListEntity>,
    @InjectRepository(UserTaskListConnectEntity)
    private connectUserRepository: Repository<UserTaskListConnectEntity>,
    @InjectRepository(TaskListConnectEntity)
    private connectTaskRepository: Repository<TaskListConnectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){}

  public async checkAccess(taskListId: number, userId: number): Promise<boolean> {
    const connect = await this.connectUserRepository.findOne({
      taskListId,
      userId
    })
    if(!connect.isOwner) throw new ForbiddenException();
    return connect.isOwner;
  }

  public async checkMemberAccess(taskListId: number, userId: number): Promise<boolean> {
    const connect = await this.connectUserRepository.findOne({
      taskListId,
      userId
    })
    return !!connect;
  }

  public async fetchListOfTaskList(userId: number): Promise<TaskListDTO[]> {
    const listOfConnect = await this.connectUserRepository.find({
      where: { userId, isArchived: false },
      order: { taskListId: 'ASC' },
      relations: [ 'taskList' ],
    });

    return listOfConnect.map(connect => ({
      id: connect.taskList.id,
      caption: connect.taskList.caption
    }));
  }

  public async createTaskList(
    userId: number, 
    data: CreateTaskListDTO
  ): Promise<TaskListDTO> {
    const user = await this.userRepository.findOne(userId);
    if(!user) throw new NotFoundException();

    const createdTaskList = await this.repository.save(data);

    const createdConnect = await this.connectUserRepository.save({
      isArchived: false,
      isOwner: true,
      user,
      taskList: createdTaskList
    })

    console.table(createdTaskList);
    console.log('3')
    console.table(createdConnect);

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

    const listOfUserConnect = await this.connectUserRepository.find({
      where: { taskListId, isArchived: false },
      order: { userId: 'ASC' },
    });

    const listOfUserConnectPromise = listOfUserConnect.map(connect => {
      connect.isArchived = true;
      return this.connectUserRepository.save(connect);
    });

    const listOfTaskConnect = await this.connectTaskRepository.find({
      where: { taskListId, isArchived: false },
      order: { taskId: 'ASC' },
    });

    const listOfTaskConnectPromise = listOfTaskConnect.map(connect => {
      connect.isArchived = true;
      return this.connectTaskRepository.save(connect);
    });

    await Promise.all([listOfUserConnectPromise, listOfTaskConnectPromise]);

    taskList.isArchived = true;

    await this.repository.save(taskList);
  }
}