

export function extractProperty<
    T extends object,
    K extends keyof T
>(tg: T, key: K): T[K] {
    return tg[key];
}