import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { OidcModule, OidcStrategy } from "../config/oidc";
import { UsersModule, UsersService } from "../users";
import { User } from "../users/model";
import { AuthController } from './controller';
import { AuthService, BlacklistService, JwtAuthService } from './service';
import { JwtAuthGuard } from "./jwt.auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { OptionsProvider } from "../common";
import { JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES, JWT_SECRET } from "./token";


const EXTERNAL_PROVIDERS = [
    UsersService,
    JwtService,
    OidcStrategy
];

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      PassportModule.register({}),
      JwtModule.register({}),
      OidcModule,
      UsersModule
  ],
  controllers: [AuthController],
  providers: [
      ...EXTERNAL_PROVIDERS,
      AuthService,
      JwtAuthService,
      BlacklistService,
      JwtStrategy,
      JwtAuthGuard,
      OptionsProvider<string>(JWT_SECRET),
      OptionsProvider<number>(JWT_ACCESS_EXPIRES),
      OptionsProvider<number>(JWT_REFRESH_EXPIRES)
  ],
  exports: [JwtAuthGuard, BlacklistService]
})
export class AuthModule {}
