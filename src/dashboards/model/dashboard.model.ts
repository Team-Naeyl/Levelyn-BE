import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Level } from "./level.model";
import { Exclude } from "class-transformer";


@Entity("dashboards")
export class Dashboard extends ModelBase{
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    exp: number;

    @Column()
    attack: number;

    @Column()
    will: number;

    @Exclude()
    @ManyToOne(() => Level)
    @JoinColumn({ name: "level_id" })
    level: Level;

    toDTO(): any {
        return {
            level: this.level.id,
            maxExp: this.level.maxExp,
            ...super.toDTO()
        };
    }

}