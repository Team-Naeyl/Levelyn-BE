import { Module } from "@nestjs/common";
import { MyPagesController } from './my-pages.controller';
import { MyPagesService } from './my-pages.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryModule, UserItem, UserItemsService, UserSkill, UserSkillsService } from "../inventory";
import { AuthModule, JwtAuthGuard } from "../auth";
import { UsersModule, UsersService } from "../users";
import { User } from "../users/model";

const EXTERNAL_PROVIDERS = [
    JwtAuthGuard,
    UsersService,
    UserItemsService,
    UserSkillsService
];

@Module({
  imports: [
      TypeOrmModule.forFeature([User, UserItem, UserSkill]),
      AuthModule,
      UsersModule,
      InventoryModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      MyPagesService
  ],
  controllers: [MyPagesController],
})
export class MyPagesModule {}