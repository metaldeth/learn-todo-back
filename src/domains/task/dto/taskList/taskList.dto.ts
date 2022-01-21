import { ApiProperty } from "@nestjs/swagger";

export class TaskListDTO {
  @ApiProperty({ description: 'The id of the task list' })
  id: number;

  @ApiProperty({ description: 'The caption of the task list' })
  caption: string;

  @ApiProperty({ description: 'The list members of the task list' })
  listOfMember: Array<{id: number, name: string, isOwner: boolean}>;
}