 import { IsNotEmpty, IsString, isNotEmpty, MaxLength, MinLength, Matches } from "class-validator";

export class AuthCredentialsDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(20, {message: "Username cannot exceeds 20 characters"})
    @MinLength(4, {message: 'Username must be 4 characters long'})
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password must be 8 characters long'})
    @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[\W_])/, {
        message:
          'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
      })
    password: string



}