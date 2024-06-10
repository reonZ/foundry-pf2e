"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlQueryAll = exports.htmlQuery = exports.htmlClosest = void 0;
function htmlQuery(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return null;
    return parent.querySelector(selectors);
}
exports.htmlQuery = htmlQuery;
function htmlQueryAll(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return [];
    return Array.from(parent.querySelectorAll(selectors));
}
exports.htmlQueryAll = htmlQueryAll;
function htmlClosest(child, selectors) {
    if (!(child instanceof Element))
        return null;
    return child.closest(selectors);
}
exports.htmlClosest = htmlClosest;
