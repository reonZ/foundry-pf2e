declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): string;
declare function render<TData extends Record<string, any>>(...args: [string, ...string[], TData | string]): Promise<string>;
export { imagePath, templatePath, render };
