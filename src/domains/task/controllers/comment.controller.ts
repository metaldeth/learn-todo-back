import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import { User, UserData } from '../../../infra/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from '../service';
import { CommentDTO, CreateCommentDTO, EditCommentDTO } from '../dto/comment';

@ApiTags('Work with Comment')
@Controller()
export class CommentController {
  constructor(private service: CommentService) {}

  @ApiOperation({ summary: 'Get list of Comment by taskId' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiResponse({ type: CommentDTO, isArray: true, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/task/:taskId/comment')
  public getListOfTaskList(
    @User() user: UserData,
    @Param('taskId') taskId: number,
  ): Promise<CommentDTO[]> {
    return this.service.fetchListOfCommentByTaskId(taskId);//todo checkAccess
  }

  @ApiOperation({ summary: 'Create a comment' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommentDTO })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiResponse({ type: CommentDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/task/:taskId/comment')
  public createTaskList(
    @User() user: UserData,
    @Param('taskId') taskId: number,
    @Body() commentDTO: CommentDTO,
  ): Promise<CommentDTO> {
    return this.service.createComment( taskId, user.userId, commentDTO );
  }

  @ApiOperation({ summary: 'Update the comment' })
  @ApiBearerAuth()
  @ApiBody({ type: EditCommentDTO })
  @ApiResponse({ type: CommentDTO, status: 200 })
  @ApiParam({ name: 'commentId', description: 'ID for the comment' })
  @UseGuards(JwtAuthGuard)
  @Put('/comment/:commentId')
  public async updateTaskList(
    @User() user: UserData,
    @Param('commentId') commentId: number,
    @Body() commentDTO: EditCommentDTO,
  ): Promise<CommentDTO> {
    const canAccess = await this.service.checkAccess(commentId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.editComment(commentId, user.userId, commentDTO);
  }

  @ApiOperation({ summary: 'Remove the comment by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Response hasn't body" })
  @ApiParam({ name: 'commentId', description: 'ID for the comment' })
  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:commentId')
  public async removeTaskList(
    @User() user: UserData,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    const canAccess = await this.service.checkAccess(commentId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.removeComment(commentId);
  }
}
