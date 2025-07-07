
export class SseEvent<TypeT, PayloadT> {
    constructor(
       public readonly type: TypeT,
       public readonly payload: PayloadT
    ) {}
}