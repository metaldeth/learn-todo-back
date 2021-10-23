import { ApiProperty } from "@nestjs/swagger";

export class TaskDTO {
  @ApiProperty({ description: 'The id of the task' })
  id: number;

  @ApiProperty({ description: 'THe id of the task list' })
  taskListId: number;

  @ApiProperty({ description: 'The caption of the task' })
  caption: string;

  @ApiProperty({ description: 'The description of the task' })
  description: string;
}