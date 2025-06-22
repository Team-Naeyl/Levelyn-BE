import { BinaryOp } from "./operators";
import { fromEntries, keys, map, pipe } from "@fxts/core";

export type NumericObject = Record<string, number>;

export function BinaryNumericObjectOp<
    NO extends NumericObject
>(
    binaryOp: BinaryOp<number>
): BinaryOp<NO> {
    return function (u: NO, v: NO): NO {
        return pipe(
            keys(v),
            map(k => [k, u[k] + v[k]] as [string, number]),
            fromEntries
        ) as NO;
    }
}