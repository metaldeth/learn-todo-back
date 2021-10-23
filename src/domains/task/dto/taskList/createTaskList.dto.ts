import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTaskListDTO {
  @ApiProperty({ description: 'The caption of the task lsit' })
  @IsString()
  caption: string;
}