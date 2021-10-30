import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ComentDTO {
  @ApiProperty({ description: 'The id of the coment' })
  id: number;

  @ApiProperty({ description: 'The caption of the coment' })
  caption: string;

  @ApiProperty({ description: 'The id of the task' })
  taskId: number;
}