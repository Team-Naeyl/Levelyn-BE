import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from "../users";
import { UserItemsService, UserSkillsService } from "../inventory";
import { MyPageDTO, UpdateProfileDTO } from "./dto";

@Injectable()
export class MyPagesService {

    constructor(
        @Inject(UsersService)
        private readonly _usersService: UsersService,
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService,
    ) {}

    async getMyPage(userId: number): Promise<MyPageDTO> {
        const { name, email, state, wallet } = await this._usersService.getUser(userId);
        const itemsSlot = await this._userItemsService.getUserItems({ userId, equipped: true });
        const skillsSlot = await this._userSkillsService.getUserSkills({ userId, equipped: true });
        const profile = { name, email };
        const character = { state, wallet, itemsSlot, skillsSlot };
        return { profile, character };
    }

    async updateProfile(dto: UpdateProfileDTO): Promise<void> {
        await this._usersService.updateUser(dto);
    }
}
