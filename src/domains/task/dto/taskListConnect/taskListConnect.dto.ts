import { ApiProperty } from "@nestjs/swagger";

export class TaskListConnectDTO {
  @ApiProperty({ description: 'The id of the task with taskList connect' })
  id: number;

  @ApiProperty({ description: 'The id of the task' })
  taskId: number;

  @ApiProperty({ description: 'The id of the task list' })
  taskListId: number;
}