import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UsersModule, UsersService } from "../users";
import { JwtModule, JwtService, JwtStrategy } from "../config/jwt";
import { OidcModule, OidcStrategy } from "../config/oidc";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwt.auth.guard";
import { BlacklistService } from "./blacklist.service";

const EXTERNAL_PROVIDERS = [
    UsersService,
    JwtService,
    JwtStrategy,
    OidcStrategy
]

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      PassportModule.register({}),
      UsersModule,
      JwtModule,
      OidcModule
  ],
  controllers: [AuthController],
  providers: [
      ...EXTERNAL_PROVIDERS,
      AuthService,
      JwtAuthGuard,
      BlacklistService
  ],
  exports: [
      JwtAuthGuard,
      BlacklistService
  ]
})
export class AuthModule {}
