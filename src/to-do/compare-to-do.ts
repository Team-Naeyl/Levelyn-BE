import { ToDoDTO } from "./dto";

export function compareToDo(td1: ToDoDTO, td2: ToDoDTO): number {
    const p1 = td1.period.map(d => d.getTime());
    const p2 = td2.period.map(d => d.getTime());
    return p1[0] !== p2[0] ? p1[0] - p2[0] : p1[1] - p2[1];
}