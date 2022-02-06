import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class EditTaskListDTO {
  @ApiProperty({ description: 'The caption of the task list' })
  @IsString() 
  caption: string;

  @ApiProperty({ description: 'The falg isFavorite of the task list' })
  @IsBoolean()
  isFavorite: boolean;
}