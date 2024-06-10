"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.templateLocalize = exports.subLocalize = exports.localizeIfExist = exports.localize = exports.localeCompare = exports.info = exports.hasLocalization = exports.error = void 0;
const module_1 = require("./module");
const utils_1 = require("./utils");
function notify(str, arg1, arg2, arg3) {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : undefined;
    const permanent = typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;
    ui.notifications.notify(localize(str, data), type, { permanent });
}
function warn(str, arg1, arg2) {
    notify(str, "warning", arg1, arg2);
}
exports.warn = warn;
function info(str, arg1, arg2) {
    notify(str, "info", arg1, arg2);
}
exports.info = info;
function error(str, arg1, arg2) {
    notify(str, "error", arg1, arg2);
}
exports.error = error;
function localize(...args) {
    args.unshift(module_1.MODULE.id);
    const data = typeof args.at(-1) === "object" ? args.pop() : undefined;
    const path = (0, utils_1.joinStr)(".", args);
    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }
    return game.i18n.localize(path);
}
exports.localize = localize;
function templateLocalize(subKey) {
    const fn = (key, { hash }) => localize(subKey, key, hash);
    Object.defineProperties(fn, {
        path: {
            value: (key) => module_1.MODULE.path(subKey, key),
            enumerable: false,
            configurable: false,
        },
    });
    return fn;
}
exports.templateLocalize = templateLocalize;
function localeCompare(a, b) {
    return a.localeCompare(b, game.i18n.lang);
}
exports.localeCompare = localeCompare;
function hasLocalization(...path) {
    return game.i18n.has(`${module_1.MODULE.path(path)}`, false);
}
exports.hasLocalization = hasLocalization;
function localizeIfExist(...args) {
    args.unshift(module_1.MODULE.id);
    const data = typeof args.at(-1) === "object" ? args.pop() : undefined;
    const path = (0, utils_1.joinStr)(".", args);
    if (!game.i18n.has(path, false))
        return;
    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }
    return game.i18n.localize(path);
}
exports.localizeIfExist = localizeIfExist;
function subLocalize(subKey) {
    const fn = (...args) => localize(subKey, ...args);
    Object.defineProperties(fn, {
        ifExist: {
            value: (...args) => localizeIfExist(subKey, ...args),
            enumerable: false,
            configurable: false,
        },
        warn: {
            value: (str, arg1, arg2) => warn(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        info: {
            value: (str, arg1, arg2) => info(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        error: {
            value: (str, arg1, arg2) => error(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        has: {
            value: (key) => hasLocalization(subKey, key),
            enumerable: false,
            configurable: false,
        },
        path: {
            value: (key) => module_1.MODULE.path(subKey, key),
            enumerable: false,
            configurable: false,
        },
        sub: {
            value: (key) => subLocalize(`${subKey}.${key}`),
            enumerable: false,
            configurable: false,
        },
        i18n: {
            get() {
                return templateLocalize(subKey);
            },
            enumerable: false,
            configurable: false,
        },
    });
    return fn;
}
exports.subLocalize = subLocalize;
