import { ModelBase } from "../../common";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserOwningDTO } from "../dto/user.owning.dto";

export abstract class UserOwning<
    OwnedT extends ModelBase<ModelBase.DTOType<OwnedT>>,
> extends ModelBase<
    UserOwningDTO<ModelBase.DTOType<OwnedT>>
> {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    toDTO(): UserOwningDTO<ModelBase.DTOType<OwnedT>> {
        return {
            ...this.owned().toDTO(),
            ...super.toDTO(),
        };
    }

    protected abstract owned(): OwnedT;
}