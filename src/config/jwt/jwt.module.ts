import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { OptionsProvider } from "../../common";
import { JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES, JWT_SECRET } from "./jwt.options.tokens";
import { JwtService } from "./jwt.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [PassportModule.register({})],
    providers: [
        JwtService,
        JwtStrategy,
        OptionsProvider<string>(JWT_SECRET),
        OptionsProvider<number>(JWT_ACCESS_EXPIRES),
        OptionsProvider<number>(JWT_REFRESH_EXPIRES)
    ],
    exports: [
        JwtService,
        JwtStrategy,
        JWT_SECRET,
        JWT_ACCESS_EXPIRES,
        JWT_REFRESH_EXPIRES
    ],
})
export class JwtModule {}