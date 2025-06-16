import { isDayToDo } from "./service.internal";
import { ToDoDTO, ToDoPeriodUnit } from "../dto";
import { add, sub } from "date-fns";

describe("isDayToDo", () => {
    const day = new Date(2025, 6, 13); // Jan 1, 2024

    it("Returns true if the day matches the to-do date exactly", () => {
        const toDo: ToDoDTO = { date: day } as ToDoDTO;
        expect(isDayToDo(day, toDo)).toBe(true);
    });

    it("Returns false if the day does not match to-do date and to-do is not periodic", () => {
        const date = new Date(2025, 5, 17)
        const toDo: ToDoDTO = { date, period: null } as ToDoDTO;
        expect(isDayToDo(day, toDo)).toBe(false);
    });

    it("Returns true for valid recurring to-dos on matching day", () => {
        const amount = 3;

        const toDoList = (["days", "weeks", "months", "years"] as ToDoPeriodUnit[])
            .map(unit => ({
                date: sub(day, { [unit]: amount }),
                period: { unit, amount }
            }) as ToDoDTO);

        expect(toDoList.map(toDo => isDayToDo(day, toDo))).toEqual([true, true, true, true]);
    });

    it("returns false for recurring to-dos if day is not in correct interval", () => {
        const toDo: ToDoDTO = {
            date: day,
            period: {
                unit: "weeks",
                amount: 1,
            },
        } as ToDoDTO;
        const nonMatchingDay = add(day, { days: 10 }); // Not exactly 1 week
        expect(isDayToDo(nonMatchingDay, toDo)).toBe(false);
    });

    it("returns false for recurring to-dos if day is not in correct interval-2", () => {

        const toDo: ToDoDTO = {
            date: day,
            period: {
                unit: "months",
                amount: 1,
            },
        } as ToDoDTO;

        const nonMatchingDay = add(day, { days: 30 }); // Not exactly 1 week
        expect(isDayToDo(nonMatchingDay, toDo)).toBe(false);
    });
});