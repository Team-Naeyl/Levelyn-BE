import { UserInfo } from "./user.info";
import { IsEmail, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class TokenPayload implements UserInfo {
    @IsNumber()
    id: number;
    @IsNumber()
    dashboardId: number;
    @IsNumber()
    walletId: number;
    @Matches(/^[A-Za-z0-9+/]{43}=$/)
    salt: string;
    @IsNumber()
    iat: number;
    @IsNumber()
    exp: number;
}