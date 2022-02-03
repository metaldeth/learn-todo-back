import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class EditTaskDTO {
  @ApiProperty({ description: 'The caption of the task' })
  @IsString()
  caption: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The flag isComplete of the task by this taskList' })
  @IsBoolean()
  isComplete: boolean;
}