import { instanceToPlain } from "class-transformer";

class Vec {
    x: number;
    y: number;
    get norm(): number {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
}

const v = new Vec();
v.x = 3;
v.y = 4;

console.log(instanceToPlain([v])[0]);