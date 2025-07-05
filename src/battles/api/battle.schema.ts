import { ApiExtraModels, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { PlayerSchema } from "./player.schema";
import { MobSchema } from "./mob.schema";

@ApiSchema()
@ApiExtraModels(PlayerSchema, MobSchema)
export class BattleSchema {
    @ApiProperty({ name: "id", type: "string" })
    id: string;

    @ApiProperty({ type: () => PlayerSchema })
    player: PlayerSchema;

    @ApiProperty({ type: () => MobSchema })
    mob: MobSchema;
}