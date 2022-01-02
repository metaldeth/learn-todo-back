import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateComentDTO {
  @ApiProperty({ description: 'The caption of the coment' })
  @IsString()
  caption: string;
}