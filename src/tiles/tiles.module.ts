import { Module } from "@nestjs/common";
import { TilesSaga } from "./tiles.saga";
import { YamlConfigModule } from "../config/yaml-config";
import { TileConfig } from "../game";

@Module({
  imports: [YamlConfigModule.forFeature([TileConfig])],
  providers: [TilesSaga]
})
export class TilesModule {}