import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.model";
import { UpsertUserDTO, GetUserDTO, UserDTO } from "../dto";

@Injectable()
export class UsersService {
    private readonly _logger: Logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly _usersRepos: Repository<User>
    ) {}

    async upsertUser(dto: UpsertUserDTO): Promise<UserDTO> {
        const user: User = await this._usersRepos.save(dto);
        return user.toDTO();
    }

    async getUserBy(dto: GetUserDTO): Promise<UserDTO> {
        const user = await this._usersRepos.findOneBy(dto);
        if (!user) throw new UnauthorizedException();
        return user.toDTO();
    }

    async deleteUser(id: number): Promise<void> {
        await this._usersRepos.delete(id);
    }
}
