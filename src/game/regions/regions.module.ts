import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Region } from "./region.model";
import { YamlConfigModule } from "../../config/yaml-config";
import { RegionConfig } from "../config";
import { RegionsService } from "./regions.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Region]),
        YamlConfigModule.forFeature([RegionConfig])
    ],
    providers: [RegionsService],
    exports: [RegionsService],
})
export class RegionsModule {}