import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { PlayerSchema } from "../../../players/dto";
import { WalletSchema } from "../../../wallets/dto";

export class SignInQuery {
    @ApiProperty({ type: "string", description: "카카오 토큰" })
    token: string;
}

@ApiExtraModels(PlayerSchema, WalletSchema)
export class SignInResponse {
    @ApiProperty({ type: "string", description: "액세스 토큰" })
    accessToken: string;

    @ApiProperty({ type: PlayerSchema })
    player: PlayerSchema;

    @ApiProperty({ type: WalletSchema })
    wallet: WalletSchema;
}