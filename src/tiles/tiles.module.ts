import { Module } from "@nestjs/common";
import { TilesSaga } from "./tiles.saga";
import { YamlConfigModule } from "../config/yaml-config";
import { TileConfig } from "../game";
import { TilesService } from "./tiles.service";
import { SetPenaltyHandler } from "./set.penalty.handler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tile } from "./tile.model";

@Module({
  imports: [
      TypeOrmModule.forFeature([Tile]),
      YamlConfigModule.forFeature([TileConfig])
  ],
  providers: [TilesService, TilesSaga, SetPenaltyHandler]
})
export class TilesModule {}