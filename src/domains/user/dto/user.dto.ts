import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
  @ApiProperty({ description: 'Id of the user' })
  id: number;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;
}