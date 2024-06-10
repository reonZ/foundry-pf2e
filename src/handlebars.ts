import { MODULE } from "./module";
import { joinStr } from "./utils";

function templatePath(...path: string[]) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function render(...args: [string, ...string[], Record<string, any>]) {
    const data = typeof args.at(-1) === "object" ? (args.pop() as Record<string, any>) : {};
    const path = templatePath(...(args as string[]));
    return renderTemplate(path, data);
}

export { templatePath, render };
