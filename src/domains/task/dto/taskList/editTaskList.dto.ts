import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EditTaskListDTO {
  @ApiProperty({ description: 'The caption of the task list' })
  @IsString()
  caption: string;
}