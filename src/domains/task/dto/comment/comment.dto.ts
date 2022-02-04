import { ApiProperty } from "@nestjs/swagger";

export class CommentDTO {
  @ApiProperty({ description: 'The id of the comment' })
  id: number;

  @ApiProperty({ description: 'The caption of the comment' })
  caption: string;

  @ApiProperty({ description: 'The name of the user' })
  userName: string;
}