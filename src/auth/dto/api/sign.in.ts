import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { StateSchema } from "../../../states/dto";
import { WalletSchema } from "../../../wallets/dto";

export class SignInQuery {
    @ApiProperty({ type: "string", description: "카카오 토큰" })
    token: string;
}

@ApiExtraModels(StateSchema, WalletSchema)
export class SignInResponse {
    @ApiProperty({ type: "string", description: "액세스 토큰" })
    accessToken: string;

    @ApiProperty({ type: StateSchema })
    player: StateSchema;

    @ApiProperty({ type: WalletSchema })
    wallet: WalletSchema;
}