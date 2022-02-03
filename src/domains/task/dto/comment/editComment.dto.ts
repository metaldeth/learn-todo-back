import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EditCommentDTO {
  @ApiProperty({ description: 'The caption of the comment' })
  @IsString()
  caption: string;
}