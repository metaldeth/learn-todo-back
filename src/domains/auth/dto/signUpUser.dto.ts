import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignUpUserDTO {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @MinLength(5)
  name: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}