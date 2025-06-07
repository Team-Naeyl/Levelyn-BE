import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";


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
}