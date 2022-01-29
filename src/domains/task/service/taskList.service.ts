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
    const listOfUser = await this.userRepository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' },
    })
    const mapOfUserName: Record<number, string> = {};
    if(!listOfUser[0]) throw new NotFoundException();
    listOfUser.forEach(user => mapOfUserName[user.id] = user.name);

    const listOfConnect = await this.connectUserRepository.find({
      where: { userId, isArchived: false },
      order: { taskListId: 'ASC' },
    });

    const listOfTaskList = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' },
    });

    const mapOfTaskList: Record<number, TaskListEntity> = {};

    listOfTaskList.forEach(taskList => {
      mapOfTaskList[taskList.id] = taskList;
    })

    return listOfConnect.map(connect => {
      const taskList = mapOfTaskList[connect.taskListId];
      return{
      id: taskList.id,
      caption: taskList.caption,
    }});
  }

  // public async fetchListOFTaskListByTask(taskId: number, userId: number): Promise<TaskListDTO[]> {
  //   const listOfUser = await this.userRepository.find({
  //     where: { isArchived: false },
  //     order: { created_at: 'ASC' },
  //   })
  //   const mapOfUserName: Record<number, string> = {};
  //   if(!listOfUser[0]) throw new NotFoundException();
  //   listOfUser.forEach(user => mapOfUserName[user.id] = user.name);

  //   const listOfConnect = await this.connectUserRepository.find({
  //     where: { userId },
  //     order: { taskListId: 'ASC' },
  //   });

  //   const listOfTaskList = await this.repository.find({
  //     where: { isArchived: false },
  //     order: { created_at: 'ASC' },
  //   });

  //   return listOfTaskList.map(taskList => ({
  //     id: taskList.id,
  //     caption: taskList.caption,
  //     listOfMember: listOfConnect.map(connect => ({
  //       id: connect.userId,
  //       isOwner: connect.isOwner,
  //       name: mapOfUserName[connect.userId],
  //     }))
  //   }));
  // }

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

    const listOfConnect = await this.connectUserRepository.find({
      where: { taskListId },
      order: { userId: 'ASC' }
    })

    listOfConnect.forEach(async connect => {
      connect.isArchived = true;
      await this.connectUserRepository.save(connect);
    })

    taskList.isArchived = true;

    await this.repository.save(taskList);
  }
}