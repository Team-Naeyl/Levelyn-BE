import "reflect-metadata";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";

type __DTOType<M extends ModelBase<any>>
    = M extends ModelBase<infer DTO> ? DTO : never;

export abstract class ModelBase<DTO = any> {
    @Exclude()
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    toDTO(): DTO {
        return instanceToPlain(this)[0];
    }

    static toDTOArray<
        M extends ModelBase<__DTOType<M>>
    >(models: M[]): __DTOType<M>[] {
        return models.map(model => model.toDTO());
    }
}