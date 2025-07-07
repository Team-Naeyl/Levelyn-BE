import { HttpException, InternalServerErrorException } from "@nestjs/common";

export function makeHttpException(err: any): HttpException {
    return err instanceof HttpException
        ? err : new InternalServerErrorException(err);
}