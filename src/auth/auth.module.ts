import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService, JwtStrategy } from "../config/jwt";
import { OidcModule, OidcStrategy } from "../config/oidc";
import { User, UsersModule, UsersService } from "../users";
import { AuthController } from './controller';
import { AuthService, BlacklistService } from './service';
import { JwtAuthGuard } from "./jwt.auth.guard";

const EXTERNAL_PROVIDERS = [
    UsersService,
    JwtService,
    JwtStrategy,
    OidcStrategy
];

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
