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

function arrayToSelect<T extends string>(values: Iterable<T>, labelize: (value: T) => string) {
    const entries: { value: T; label: string }[] = [];

    for (const value of values) {
        entries.push({ value, label: labelize(value) });
    }

    return entries;
}

export { arrayToSelect, imagePath, templatePath, render };
