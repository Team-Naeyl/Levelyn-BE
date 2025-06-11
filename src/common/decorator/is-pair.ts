import { ArrayMaxSize, ArrayMinSize, IsArray, ValidatorOptions } from "class-validator";
import { applyDecorators } from "@nestjs/common";

export function IsPair() {
   return applyDecorators(
       IsArray,
       ArrayMaxSize(2),
       ArrayMinSize(2)
   );
}