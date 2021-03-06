import { ApiProperty } from "@nestjs/swagger";

export class TaskDTO {
  @ApiProperty({ description: 'The id of the task' })
  id: number;

  @ApiProperty({ description: 'The caption of the task' })
  caption: string;

  @ApiProperty({ description: 'The description of the task' })
  description: string;

  @ApiProperty({ description: 'The flag isComplete of the task by this taskList' })
  isComplete: boolean;
}