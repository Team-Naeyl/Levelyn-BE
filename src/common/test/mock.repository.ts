import { ModelBase } from "../model.base";
import { isArray } from "@fxts/core";

export function MockRepository<ModelT extends ModelBase & { id: number; }>(
    Model: { new (...args: any[]): ModelT },
    init: Partial<ModelT>[]
) {
    const db = new Map<number, ModelT>(init.map((val, idx) => {
        return [
            idx + 1,
            Object.assign(val, { id: idx + 1 })
        ] as [number, ModelT];
    }));

    let cnt = db.size;

    const saveMock = jest.fn();
    const findByMock = jest.fn();
    const findOneByMock = jest.fn();
    const updateMock = jest.fn();
    const deleteMock = jest.fn();

    saveMock.mockImplementation(async (data: Partial<ModelT> | Partial<ModelT>[]) => {
        isArray(data)
            ? data.forEach(x => db.set(++cnt, { id: cnt, ...x } as ModelT) )
            : db.set(++cnt, { id: cnt, ...data } as ModelT);
    });


}