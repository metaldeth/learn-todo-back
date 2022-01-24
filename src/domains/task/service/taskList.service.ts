import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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

  public async checkAccess(taskListId: number, userId: number): Promise<boolean> {
    const connect = await this.connectUserRepository.findOne({
      taskListId,
      userId
    })
    if(!connect.isOwner) throw new ForbiddenException();
    return connect.isOwner;
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
      where: { userId },
      order: { taskListId: 'ASC' },
    });

    const listOfTaskList = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' },
    });

    return listOfTaskList.map(taskList => ({
      id: taskList.id,
      caption: taskList.caption,
      listOfMember: listOfConnect.map(connect => ({
        id: connect.userId,
        isOwner: connect.isOwner,
        name: mapOfUserName[connect.userId],
      }))
    }));
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
      isOwner: true,
      taskList: createdTaskList,
      user
    })

    return{
      id: createdTaskList.id,
      caption: createdTaskList.caption,
      listOfMember: [
        {
          id: createdConnect.userId,
          isOwner: createdConnect.isOwner,
          name: user.name,
        }
      ]
    };
  }

  public async editTaskList(dataRes: EditTaskListRes): Promise<TaskListDTO> {
    const { data, taskListId } = dataRes;

    const listOfUser = await this.userRepository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' },
    })
    const mapOfUserName: Record<number, string> = {};
    if(!listOfUser[0]) throw new NotFoundException();
    listOfUser.forEach(user => mapOfUserName[user.id] = user.name);

    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    const listOfConnect = await this.connectUserRepository.find({
      where: { taskListId: taskList.id },
      order: { userId: 'ASC' },
    })
    if(!listOfConnect[0]) throw new NotFoundException();

    taskList.caption = data.caption;

    const updatedTaskList = await this.repository.save(taskList);

    return{
      id: updatedTaskList.id,
      caption: updatedTaskList.caption,
      listOfMember: listOfConnect.map(connect => ({
        id: connect.userId,
        isOwner: connect.isOwner,
        name: mapOfUserName[connect.userId],
      }))
    };
  }

  public async removeTaskList(taskListId: number): Promise<void> {
    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    taskList.isArchived = true;

    await this.repository.save(taskList);
  }
}