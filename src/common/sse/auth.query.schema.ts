import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthQuerySchema {
    @ApiProperty({ type: "string", description: "액세스 토큰" })
    @IsString()
    @IsNotEmpty()
    token: string;
}