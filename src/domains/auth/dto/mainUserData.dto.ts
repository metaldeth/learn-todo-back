import { ApiProperty } from "@nestjs/swagger";

export class MainUserDataDTO {
  @ApiProperty({ description: 'The identifier of the user' })
  id: number;

  @ApiProperty({ description: 'The name of the user' })
  name: string;
}