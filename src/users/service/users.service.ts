import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../model";
import { UpsertUserDTO, UserDTO } from "../dto";
import { excludeTimestamp, excludeTimestampOnly } from "../../common";

@Injectable()
export class UsersService {
    private readonly _logger: Logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly _usersRepos: Repository<User>
    ) {  }

    async upsertUser(dto: UpsertUserDTO): Promise<UserDTO> {
        const { state, wallet, ...rest } = await this.getOrCreateUser(dto);

        return {
            ...excludeTimestampOnly(rest),
            state: excludeTimestamp(state, "id"),
            wallet: excludeTimestamp(wallet, "id")
        };
    }

    private async getOrCreateUser(dto: UpsertUserDTO): Promise<User> {
        const user = await this._usersRepos.findOneBy({ openId: dto.openId });
        return user ?? await this._usersRepos.save({ ...dto, state: {}, wallet: {} });
    }
}


