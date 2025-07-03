import { ApiExtraModels, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { StateSchema } from "../../../states/dto";
import { WalletSchema } from "../../../wallets/dto";
import { UserItemSchema, UserSkillSchema } from "../../../inventory/dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@ApiSchema()
export class ProfileSchema {
    @ApiProperty({ type: "string" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ type: "string" })
    @IsEmail()
    email: string;
}

@ApiSchema()
@ApiExtraModels(StateSchema, WalletSchema, UserItemSchema, UserSkillSchema)
export class CharacterSchema {
    @ApiProperty({ type: StateSchema, description: "현재 스탯 및 위치" })
    state: StateSchema;

    @ApiProperty({ type: WalletSchema, description: "현재 잔액" })
    wallet: WalletSchema;

    @ApiProperty({ type: [UserItemSchema], description: "장착중인 아이템" })
    itemsSlot: UserItemSchema[];

    @ApiProperty({ type: [UserSkillSchema], description: "장착중인 스킬" })
    skillsSlot: UserSkillSchema[];
}

@ApiSchema()
@ApiExtraModels(ProfileSchema, CharacterSchema)
export class MyPageSchema {
    @ApiProperty({ type: ProfileSchema })
    profile: ProfileSchema;

    @ApiProperty({ type: CharacterSchema })
    character: CharacterSchema;
}