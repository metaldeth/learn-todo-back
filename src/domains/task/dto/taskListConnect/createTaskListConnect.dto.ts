import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateTaskListConnectDTO {
  @ApiProperty({ description: 'The id of the task' })
  @IsNumber()
  taskId: number;

  @ApiProperty({ description: 'The id of the task list' })
  @IsNumber()
  taskListId: number;
}