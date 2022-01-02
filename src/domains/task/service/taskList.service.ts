import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
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
  ){}

  public async checkAccess(taskListId: number): Promise<boolean> {
    const taskList = await this.repository.findOne(taskListId);
    if(!taskList) throw new NotFoundException(); 
    return !!taskList; //todo
  }

  public async fetchListOfTaskList(): Promise<TaskListDTO[]> {
    const listOfTaskList = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return listOfTaskList.map(item => ({
      id: item.id,
      caption: item.caption,
    }));
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