declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): string;
declare function render<TData extends Record<string, any>>(...args: [string, ...string[], TData | string]): Promise<string>;
declare function arrayToSelect<T extends string>(values: Iterable<T | {
    value: T;
    label: string;
}>, labelize?: (value: T) => string, localize?: boolean): {
    value: T;
    label: string;
}[];
export { arrayToSelect, imagePath, templatePath, render };
