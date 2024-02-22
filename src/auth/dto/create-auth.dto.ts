import { IsString, IsEmail, IsEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsEmpty()
  email: string;

  @IsEmpty()
  @MinLength(6)
  password: string;
}
