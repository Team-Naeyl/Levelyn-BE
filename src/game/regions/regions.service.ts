import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { Region } from "./region.model";
import { InjectRepository } from "@nestjs/typeorm";
import { RegionConfig } from "../config";

@Injectable()
export class RegionsService implements OnModuleInit{
    private readonly _interval: number;
    private _nRegions: number = 0;

    constructor(
        @InjectRepository(Region)
        private readonly _regionsRepos: Repository<Region>,
        @Inject(RegionConfig)
        regionConfig: RegionConfig
    ) {
        this._interval = regionConfig.interval;
    }

    async onModuleInit(): Promise<void> {
        this._nRegions = await this._regionsRepos.count();
    }


    getRegion(position: number): number {
        return (Math.floor(position / this._interval) % this._nRegions) + 1;
    }
}