import { MODULE } from "./module";
import { joinStr } from "./utils";

function templatePath(...path: string[]) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function imagePath(...args: [...string[], "svg" | "webp"]) {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}`;
}

function render<TData extends Record<string, any>>(...args: [string, ...string[], TData | string]) {
    const data = typeof args.at(-1) === "object" ? (args.pop() as TData) : {};
    const path = templatePath(...(args as string[]));
    return renderTemplate(path, data);
}

export { imagePath, templatePath, render };
