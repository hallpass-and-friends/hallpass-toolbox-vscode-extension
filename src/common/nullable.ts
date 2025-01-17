
export type Nullable<T> = T | null | undefined;
export type Nullish = null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;

export function isNullish(value: unknown): value is Nullish {
  return value === null || value === undefined;
}

