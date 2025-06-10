export interface GetUserSkillsDTO {
    userId: number;
    skillIds?: number[];
    equipped?: boolean;
}