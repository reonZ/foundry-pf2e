import { MODULE } from "./module";
import { joinStr } from "./utils";
import * as R from "remeda";

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

function arrayToSelect<T extends string>(
    values: Iterable<T | { value: T; label: string }>,
    localize?: boolean | ((label: string) => string)
) {
    const entries: { value: T; label: string }[] = [];
    const localizer =
        typeof localize === "function"
            ? localize
            : localize === true
            ? game.i18n.localize.bind(game.i18n)
            : (label: string) => label;

    for (const value of values) {
        const entry = typeof value === "string" ? { value, label: value } : value;

        entries.push({
            value: entry.value,
            label: localizer(entry.label),
        });
    }

    return entries;
}

export { arrayToSelect, imagePath, templatePath, render };
