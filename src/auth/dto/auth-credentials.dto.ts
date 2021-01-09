// dto for signing up and signing in

import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

    // class validator decorators to validate incoming data
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string;

    // using regex in matches to validate password characters
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message:'password too weak'})
    password:string;
}