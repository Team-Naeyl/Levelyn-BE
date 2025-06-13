import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignUpBody {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}