import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EditTaskDTO {
  @ApiProperty({ description: 'The caption of the task' })
  @IsString()
  caption: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  description: string;
}