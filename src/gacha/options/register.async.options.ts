import { GachaOptionsFactory } from "./gacha.options";
import { InjectionToken } from "@nestjs/common";

export interface RegisterAsyncOptions {
    optionsFactory: GachaOptionsFactory;
    inject?: InjectionToken[];
}