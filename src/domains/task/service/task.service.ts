import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskDescriptionEntity } from "src/entities/taskDescription/taskDescription.entity";
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
    @InjectRepository(TaskDescriptionEntity)
    private descriptionRepository: Repository<TaskDescriptionEntity>,
    @InjectRepository(TaskListConnectEntity)
    private listConnectRepository: Repository<TaskListConnectEntity>,
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
      description: item.taskDescription.caption
    }));
  }

  public async createTask(data: CreateTaskDTO): Promise<TaskDTO> {
    const createdTaskDescription = await this.descriptionRepository.save({
      caption: data.description
    });

    const createdTask = await this.repository.save({
      caption: data.caption,
      taskDescription: createdTaskDescription,
    });

    return{
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTaskDescription.caption,
    };
  }

  public async editTask(dataRes: EditTaskRes): Promise<TaskDTO> {
    const { data, taskId } = dataRes;

    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const taskDescription = await this.descriptionRepository.findOne(task.taskDescriptionId);
    if(!taskDescription) throw new NotFoundException();

    task.caption = data.caption;
    taskDescription.caption = data.description;

    const updatedTask = await this.repository.save(task);
    const updatedTaskDescription = await this.descriptionRepository.save(taskDescription);

    return{
      id: updatedTask.id,
      caption: updatedTask.caption,
      description: updatedTaskDescription.caption,
    };
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.repository.findOne(taskId);
    if(!task) throw new NotFoundException();
    const taskDescription = await this.descriptionRepository.findOne(task.taskDescriptionId);
    if(!taskDescription) throw new NotFoundException();

    task.isArchived = true;
    taskDescription.isArchived = true;

    await this.repository.save(task);
  }
}