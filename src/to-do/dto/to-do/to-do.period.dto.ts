export type ToDoPeriodUnit = "years" | "months" | "weeks" | "days";

export interface ToDoPeriodDTO {
    amount: number;
    unit: ToDoPeriodUnit;
}