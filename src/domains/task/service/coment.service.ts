import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComentEntity } from "src/entities/coment/coment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { Repository } from "typeorm";
import { ComentDTO, CreateComentDTO, EditComentDTO } from "../dto/coment";

type CreateConnectRes = {
  comentDTO: CreateComentDTO;
  taskId: number;
}

type EditComentRes = {
  comentDTO: EditComentDTO;
  comentId: number;
}

@Injectable()
export class ComentService {
  constructor(
    @InjectRepository(ComentEntity)
    private repository: Repository<ComentEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public async checkAccess(comentId: number): Promise<boolean> {
    const coment = await this.repository.findOne(comentId)

    if(!coment) throw new NotFoundException();
    return !!coment
  }

  public async getListOfComent(): Promise<ComentDTO[]> {
    const list = await this.repository.find({
      where: { isArchived: false },
      order: { created_at: 'ASC' }
    });

    return list.map(coment => ({
      id: coment.id,
      caption: coment.caption,
      taskId: coment.taskId,
    }));
  }

  public async createComent(data: CreateConnectRes): Promise<ComentDTO> {
    const { comentDTO, taskId } = data;

    const task = await this.taskRepository.findOne(taskId);

    const coment = {
      caption: comentDTO.caption,
      task: task
    }

    const createdTaskList = await this.repository.save(coment);

    return {
      id: createdTaskList.id,
      caption: createdTaskList.caption,
      taskId: createdTaskList.taskId
    };
  }

  public async editComent(data: EditComentRes): Promise<ComentDTO> {
    const { comentDTO, comentId } = data;

    const coment = await this.repository.findOne(comentId);

    if(!coment) throw new NotFoundException();

    coment.caption = comentDTO.caption;

    const updatedComent = await this.repository.save(coment);

    return {
      id: updatedComent.id,
      caption: updatedComent.caption,
      taskId: updatedComent.taskId,
    };
  }

  public async removeComent(comentId: number): Promise<void> {
    const coment = await this.repository.findOne(comentId)

    if(!coment) throw new NotFoundException();

    coment.isArchived = true;

    await this.repository.save(coment);
  }
}