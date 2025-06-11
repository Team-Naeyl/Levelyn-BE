import { concat, difference, pipe, toArray } from "@fxts/core";

const a = [1, 2];
const b = [1, 3];

const c = pipe(
    difference(a, b),
    concat(difference(b, a))
);



console.log(...c);
console.log(...concat(c, a));