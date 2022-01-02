import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;
}