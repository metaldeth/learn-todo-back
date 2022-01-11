import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SignInUserDTO {
  @ApiProperty({ description: 'The unique name associated whit the user' })
  @IsEmail()
  name: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;
}