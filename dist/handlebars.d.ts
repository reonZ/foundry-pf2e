declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): string;
declare function render(...args: [string, ...string[], Record<string, any>]): Promise<string>;
export { imagePath, templatePath, render };
