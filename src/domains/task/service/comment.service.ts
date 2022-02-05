import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "src/entities/comment/comment.entity";
import { TaskEntity } from "src/entities/task/task.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { Repository } from "typeorm";
import { CommentDTO, CreateCommentDTO, EditCommentDTO } from "../dto/comment";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ){}

  public async checkAccess(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.repository.findOne(commentId);
    if(!comment) throw new NotFoundException();

    const user = await this.userRepository.findOne(userId);
    if(!user) throw new NotFoundException();

    return user.id === comment.user.id;
  }

  public async fetchListOfCommentByTaskId(taskId: number): Promise<CommentDTO[]> {
    const listOfComment = await this.repository.find({
      where: { taskId, isArchived: false },
      order: { created_at: 'DESC' },
      relations: [ 'user' ],
    });

    return listOfComment.map(comment => ({
      id: comment.id,
      caption: comment.caption,
      likeCount: comment.likeCount,
      userName: comment.user.name,
    }))
  }

  public async createComment(taskId: number, userId: number, data: CreateCommentDTO): Promise<CommentDTO> {
    const user = await this.userRepository.findOne(userId);
    if(!user) throw new NotFoundException();

    const task = await this.taskRepository.findOne(taskId);
    if(!task) throw new NotFoundException();

    const createdComment = await this.repository.save({
      caption: data.caption,
      task, 
      user,
    });

    return {
      id: createdComment.id,
      caption: createdComment.caption,
      userName: user.name,
    };
  }

  public async editComment(commentId: number, userId: number, data: EditCommentDTO): Promise<CommentDTO> {
    const comment = await this.repository.findOne(commentId);

    const user = await this.userRepository.findOne(userId);

    comment.caption = data.caption;

    const updatedComment = await this.repository.save(comment);

    return{
      id: updatedComment.id,
      caption: updatedComment.caption,
      userName:  user.name,
    }
  }

  public async removeComment(commentId: number): Promise<void> {
    const comment = await this.repository.findOne(commentId);

    comment.isArchived = true;

    await this.repository.save(comment);
  }
}