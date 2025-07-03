import { UserSkillDTO } from "../dto";


export class UserSkillsAddedEvent {
    constructor(
       public readonly userId: number,
       public readonly newSkills: UserSkillDTO[]
    ) {}
}