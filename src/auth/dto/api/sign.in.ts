import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { StateSchema } from "../../../states/dto";
import { WalletSchema } from "../../../wallets/dto";
import { TileSchema } from "../../../tiles/dto";

export class SignInQuery {
    @ApiProperty({ type: "string", description: "카카오 토큰" })
    token: string;
}

@ApiExtraModels(StateSchema, TileSchema, WalletSchema)
export class SignInResponse {
    @ApiProperty({ type: "string", description: "액세스 토큰" })
    accessToken: string;

    @ApiProperty({ type: StateSchema })
    state: StateSchema;

    @ApiProperty({type: TileSchema })
    tile: TileSchema;

    @ApiProperty({ type: WalletSchema })
    wallet: WalletSchema;
}