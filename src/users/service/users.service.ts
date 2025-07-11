import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.model";
import { UpdateUserDTO, UpsertUserDTO, UserDTO } from "../dto";
import { excludeTimestamp } from "../../common";
import { isNull, pipe, tap, throwIf } from "@fxts/core";

@Injectable()
export class UsersService {
    private readonly _logger: Logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly _usersRepos: Repository<User>
    ) {  }

    async upsertUser(dto: UpsertUserDTO): Promise<UserDTO> {
        return pipe(
            await this.getOrCreateUser(dto),
            tap(user => this._logger.log(user)),
            __toDTO
        );
    }

    async getUser(id: number): Promise<UserDTO> {
        return pipe(
            await this._usersRepos.findOne({
                relations: { state: true, wallet: true, tile: true },
                where: { id },
            }),
            throwIf(isNull, () => new ForbiddenException()),
            __toDTO
        );
    }

    async updateUser(dto: UpdateUserDTO): Promise<void> {
        const { id, ...values } = dto;
        await this._usersRepos.update(id, values);
    }

    private async getOrCreateUser(dto: UpsertUserDTO): Promise<User> {
        const user = await this._usersRepos.findOneBy({ email: dto.email });
        return user ?? await this._usersRepos.save({ ...dto, state: {}, wallet: {}, tile: {} });
    }
}

function __toDTO(user: User): UserDTO {
    const { state, wallet, tile,  ...rest } = user;

    return {
        ...excludeTimestamp(rest, "stateId", "tileId", "walletId"),
        state: excludeTimestamp(state, "id"),
        tile: excludeTimestamp(tile, "id"),
        wallet: excludeTimestamp(wallet, "id")
    };
}


