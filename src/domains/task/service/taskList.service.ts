import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { Repository } from "typeorm";
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from "../dto/taskList";

type EditTaskListRes = {
  data: EditTaskListDTO;
  taskListId: number;
}

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private repository: Repository<TaskListEntity>
  ) {}

  public async checkAccess(taskListId: number): Promise<boolean> {
    const taskList = await this.repository.findOne(taskListId)

    if(!taskList) throw new NotFoundException();
    return !!taskList
  }

  public async getListOfTaskList(): Promise<TaskListDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return list.map(taskList => ({
      id: taskList.id,
      caption: taskList.caption
    }));
  }

  public async createTaskList(data: CreateTaskListDTO): Promise<TaskListDTO> {
    const createdTaskList = await this.repository.save(data);

    return {
      id: createdTaskList.id,
      caption: createdTaskList.caption,
    };
  }

  public async editTaskList(taskListDTO: EditTaskListRes): Promise<TaskListDTO> {
    const { data, taskListId } = taskListDTO;

    const taskList = await this.repository.findOne(taskListId);

    if(!taskList) throw new NotFoundException();

    taskList.caption = data.caption;

    const updatedTasklist = await this.repository.save(taskList);

    return {
      id: updatedTasklist.id,
      caption: updatedTasklist.caption,
    };
  }

  public async removeTaskLIst(taskListId: number): Promise<void> {
    const taskList = await this.repository.findOne(taskListId)

    if(!taskList) throw new NotFoundException();

    taskList.isArchived = true;

    await this.repository.save(taskList);
  }
}