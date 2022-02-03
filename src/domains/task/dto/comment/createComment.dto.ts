import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDTO {
  @ApiProperty({ description: 'The caption of the comment' })
  @IsString()
  caption: string;
}