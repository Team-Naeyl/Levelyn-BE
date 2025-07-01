import { Module } from "@nestjs/common";
import { TilesService } from './tiles.service';
import { TilesController } from './tiles.controller';

@Module({
  providers: [TilesService],
  controllers: [TilesController]
})
export class TilesModule {}