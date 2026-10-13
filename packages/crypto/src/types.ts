export type Hex = `0x${string}`;
export type CanonicalValue = string | number | boolean | CanonicalValue[] | { [key: string]: CanonicalValue };
