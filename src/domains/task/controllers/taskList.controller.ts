import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from "../dto/taskList";
import { TaskListService } from "../service";

@ApiTags('Work with task list')
@Controller()
export class TaskListController {
  constructor(
    private service: TaskListService,
  ) {}

  @ApiOperation({ summary: 'Get list of the task list' })
  @ApiBearerAuth()
  @ApiResponse({ type: TaskListDTO, isArray: true, status: 200 })
  @Get('/taskList')
  public async getListOfTaskList(): Promise<TaskListDTO[]> {
    return await this.service.getListOfTaskList();
  };

  @ApiOperation({ summary: 'Create task list' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskListDTO })
  @ApiResponse({ type: TaskListDTO, status: 200 })
  @Post('/taskList')
  public async createTaskList(
    @Body() data: CreateTaskListDTO
  ): Promise<TaskListDTO> {
    return await this.service.createTaskList(data);
  };

  @ApiOperation({ summary: 'Update task list by Id' })
  @ApiBearerAuth()
  @ApiBody({ type: EditTaskListDTO })
  @ApiParam({ name: 'taskListId', description: 'Id of the task list' })
  @ApiBody({ type: EditTaskListDTO })
  @Put('/taskList/:taskListId')
  public async editTaskList(
    @Body() data: EditTaskListDTO,
    @Param('taskListId') taskListId: number,
  ): Promise<TaskListDTO> {
    const checkAccess = await this.service.checkAccess(taskListId);
    if(!checkAccess) throw new NotFoundException();

    const taskList = await this.service.editTaskList({
      data,
      taskListId
    });

    return taskList
  };

  @ApiOperation({ summary: 'Remove task list by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'Id of the task list' })
  @ApiResponse({ status: 200, description: "Responce hasn't body" })
  @Delete('taskList/:taskListId')
  public async removeTaskList(
    @Param('taskListId') taskListId: number,
  ): Promise<void> {
    const checkAccess = await this.service.checkAccess(taskListId);
    if(!checkAccess) throw new NotFoundException();

    await this.service.removeTaskLIst(taskListId);
  };
}