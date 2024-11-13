"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.templatePath = exports.imagePath = exports.arrayToSelect = void 0;
const module_1 = require("./module");
const utils_1 = require("./utils");
function templatePath(...path) {
    return `modules/${module_1.MODULE.id}/templates/${(0, utils_1.joinStr)("/", path)}.hbs`;
}
exports.templatePath = templatePath;
function imagePath(...args) {
    const ext = args.pop();
    return `modules/${module_1.MODULE.id}/images/${(0, utils_1.joinStr)("/", args)}.${ext}`;
}
exports.imagePath = imagePath;
function render(...args) {
    const data = typeof args.at(-1) === "object" ? args.pop() : {};
    const path = templatePath(...args);
    return renderTemplate(path, data);
}
exports.render = render;
function arrayToSelect(values, labelize = (value) => value, localize) {
    const entries = [];
    for (const value of values) {
        const entry = typeof value === "string" ? { value, label: labelize(value) } : value;
        entries.push({
            value: entry.value,
            label: localize ? game.i18n.localize(entry.label) : entry.label,
        });
    }
    return entries;
}
exports.arrayToSelect = arrayToSelect;
