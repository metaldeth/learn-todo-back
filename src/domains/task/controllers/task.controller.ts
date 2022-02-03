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
import { TaskListService, TaskService } from '../service';
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from '../dto/task';

@ApiTags('Work with Task')
@Controller()
export class TaskController {
  constructor(
    private service: TaskService,
    private taskListService: TaskListService,
    ) {}

  @ApiOperation({ summary: 'Get list of task by taskListId' })
  @ApiBearerAuth()
  @ApiResponse({ type: TaskDTO, isArray: true, status: 200 })
  @ApiParam({ name: 'taskListId', description: 'Id of the taskList' })
  @UseGuards(JwtAuthGuard)
  @Get('/taskList/:taskListId/task')
  public async getListOfTask(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
  ): Promise<TaskDTO[]> {
    // const canAccess = await this.taskListService.checkMemberAccess(taskListId, user.userId);
    // if (!canAccess) throw new NotFoundException();

    return this.service.fetchListOfTaskByTaskListId(taskListId);
  }

  @ApiOperation({ summary: 'Create a task by taskListId' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskDTO })
  @ApiParam({ name: 'taskListId', description: 'Id of the taskList' })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/taskList/:taskListId/task')
  public async createTask(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
    @Body() taskDTO: CreateTaskDTO,
  ): Promise<TaskDTO> {
    const canAccess = await this.taskListService.checkMemberAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();

    return this.service.createTask(taskDTO, taskListId);
  }

  @ApiOperation({ summary: 'Update the task ' })
  @ApiBearerAuth()
  @ApiBody({ type: EditTaskDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiParam({ name: 'taskListId', description: 'ID for the taskList' })
  @UseGuards(JwtAuthGuard)
  @Put('/taskList/:taskListId/task/:taskId')
  public async updateTask(
    @User() user: UserData,
    @Param('taskId') taskId: number,
    @Param('taskListId') taskListId: number,
    @Body() taskDTO: EditTaskDTO,
  ): Promise<TaskDTO> {
    const canAccess = await this.service.checkAccess(taskId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.editTask({data: taskDTO, taskId, taskListId});
  }

  @ApiOperation({ summary: 'Remove the task by taskId and taskListId' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Response hasn't body" })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiParam({ name: 'taskListId', description: 'ID for the taskList' })
  @UseGuards(JwtAuthGuard)
  @Delete('/taskList/:taskListId/task/:taskId')
  public async removeOneTask(
    @User() user: UserData,
    @Param('taskId') taskId: number,
    @Param('taskListId') taskListId: number,
  ): Promise<void> {
    const canTaskListAccess = await this.taskListService.checkMemberAccess( taskListId, user.userId );
    if(!canTaskListAccess) throw new NotFoundException();
    const canTaskAccess = await this.service.checkAccess(taskId, user.userId);
    if (!canTaskAccess) throw new NotFoundException();
    return this.service.removeOneTask(taskId, taskListId);
  }

  @ApiOperation({ summary: 'Remove the task by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Response hasn't body" })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @UseGuards(JwtAuthGuard)
  @Delete('/task/:taskId')
  public async removeTask(
    @User() user: UserData,
    @Param('taskId') taskId: number,
  ): Promise<void> {
    const canAccess = await this.service.checkAccess(taskId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.removeTask(taskId);
  }
}
