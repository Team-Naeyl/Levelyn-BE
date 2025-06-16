import { ToDoPeriodUnit, ToDoDTO } from "../dto";
import { add, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarWeeks, differenceInCalendarYears, isSameDay} from "date-fns";

export function isDayToDo(day: Date, toDo: ToDoDTO) {
    if (isSameDay(day, toDo.date)) return true;
    if (!toDo.period) return false;

    const { date, period: { unit, amount } } = toDo;
    const diff = normalizedDifference(day, date, unit);

    return !(diff % amount) && isSameDay(day, add(date, { [unit]: diff }));
}

export function normalizedDifference(later: Date, earlier: Date, unit: ToDoPeriodUnit): number {
    switch (unit) {
        case "days": return differenceInCalendarDays(later, earlier);
        case "weeks": return differenceInCalendarWeeks(later, earlier);
        case "months": return differenceInCalendarMonths(later, earlier);
        case "years": return differenceInCalendarYears(later, earlier);
    }
}