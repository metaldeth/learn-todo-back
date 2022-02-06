import { ApiProperty } from "@nestjs/swagger";
export class TaskListDTO {
  @ApiProperty({ description: 'The id of the task list' })
  id: number;

  @ApiProperty({ description: 'The caption of the task list' })
  caption: string;

  @ApiProperty({ description: 'The flag isFavorite of the task list' })
  isFavorite: boolean;
}