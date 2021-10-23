import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task/task.entity";
import { TaskListEntity } from "src/entities/taskList/taskList.entity";
import { Repository } from "typeorm";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";

type CreateTaskRes = {
  data: CreateTaskDTO;
  taskListId: number;
}

type EditTaskRes = {
  data: EditTaskDTO,
  taskId: number;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public async checkAccess(taskId: number): Promise<boolean> {
    const task = await this.taskRepository.findOne(taskId);

    if(!task) throw new NotFoundException();

    return !!task;
  };

  public async getListOfTaskByTaskListId(tasklistId: number): Promise<TaskDTO[]> {
    const taskList = await this.taskListRepository.findOne(tasklistId)
    if(!taskList) throw new NotFoundException();

    const listOfTask = await this.taskRepository.find({
      where: { isArchived: false, taskListId: taskList.id },
      order: { created_at: 'ASC' },
    });

    return listOfTask.map(task => ({
      id: task.id,
      taskListId: task.taskListId,
      caption: task.caption,
      description: task.description,
    }));
  };

  public async createTask(taskDTO: CreateTaskRes): Promise<TaskDTO> {
    const { data, taskListId } = taskDTO;

    const taskList = await this.taskListRepository.findOne(taskListId);
    if(!taskList) throw new NotFoundException();

    const savedTask = await this.taskRepository.save({
      caption: data.caption,
      description: data.description,
      taskList
    });

    return {
      id: savedTask.id,
      caption: savedTask.caption,
      description: savedTask.description,
      taskListId: savedTask.taskListId,
    };
  };

  public async editTask(taskDTO: EditTaskRes): Promise<TaskDTO> {
    const { data, taskId } = taskDTO;

    const task = await this.taskRepository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.caption = data.caption;
    task.description = data.description;

    const updatedTask = await this.taskRepository.save(task);

    return {
      id: updatedTask.id,
      taskListId: updatedTask.taskListId,
      caption: updatedTask.caption,
      description: updatedTask.description,
    };
  };

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne(taskId);
    if(!task) throw new NotFoundException();

    task.isArchived = true;

    await this.taskRepository.save(task);
  };
}