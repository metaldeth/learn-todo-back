import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from "../dto/task";
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from "../dto/taskList";
import { TaskListService, TaskService } from "../service";

@ApiTags('Work with task')
@Controller()
export class TaskController {
  constructor(
    private service: TaskService,
    private tasklistService: TaskListService,
  ) {}

  @ApiOperation({ summary: 'Get list of the task by task list id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'Id of the task list' })
  @ApiResponse({ type: TaskDTO, isArray: true, status: 200 })
  @Get('/taskList/:taskListId/task')
  public async getListOfTaskByTaskListId(
    @Param('taskListId') taskListId: number,
  ): Promise<TaskDTO[]> {
    const checkAccess = await this.tasklistService.checkAccess(taskListId);
    if(!checkAccess) throw new NotFoundException();

    return await this.service.getListOfTaskByTaskListId(taskListId);
  };

  @ApiOperation({ summary: 'Create task by task list Id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'Id of the task list' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({ type: TaskDTO, isArray: true, status: 200 })
  @Post('/taskList/:taskListId/task')
  public async createTask(
    @Param('taskListId') taskListId: number,
    @Body() data: CreateTaskDTO,
  ): Promise<TaskDTO> {
    const canAccess = await this.tasklistService.checkAccess(taskListId);
    if(!canAccess) throw new NotFoundException();

    return await this.service.createTask({
      data,
      taskListId
    });
  };

  @ApiOperation({ summary: 'Update task' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskId', description: 'Id of the task' })
  @ApiBody({ type: EditTaskDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @Put('task/:taskId')
  public async editTask(
    @Body() data: EditTaskDTO,
    @Param('taskId') taskId: number,
  ): Promise<TaskDTO> {
    const canAccess = await this.service.checkAccess(taskId);
    if(!canAccess) throw new NotFoundException();

    return await this.service.editTask({
      data,
      taskId
    });
  };

  @ApiOperation({ summary: 'Remove task by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskId', description: 'Id of the task' })
  @ApiResponse({ status: 200, description: "Responce hasn't body" })
  @Delete('task/:taskId')
  public async removeTask(
    @Param('taskId') taskId: number,
  ): Promise<void> {
    const canAccess = await this.service.checkAccess(taskId);
    if(!canAccess) throw new NotFoundException();

    await this.service.removeTask(taskId);
  };
}