declare function joinStr(separator: "/" | "." | "-", ...path: (string | string[])[]): string;
declare function stringBoolean(b: boolean | string): "false" | "true";
declare function stringNumber(n: number | string): `${number}`;
declare function compareArrays<T extends any>(arr1: T[], arr2: T[], unique?: boolean): boolean;
declare function arrayIncludes(array: string[], other: string[]): boolean;
export { arrayIncludes, compareArrays, joinStr, stringBoolean, stringNumber };
