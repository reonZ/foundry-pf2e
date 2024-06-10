"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterWrapper = exports.registerWrapper = exports.createWrapper = void 0;
const module_1 = require("./module");
function registerWrapper(path, callback, type, context) {
    const ids = [];
    const paths = Array.isArray(path) ? path : [path];
    const wrapped = context
        ? function (...args) {
            args.unshift(this);
            callback.apply(context, args);
        }
        : callback;
    for (const key of paths) {
        const id = libWrapper.register(module_1.MODULE.id, key, wrapped, type);
        ids.push(id);
    }
    // @ts-ignore
    return ids.length === 1 ? ids[0] : ids;
}
exports.registerWrapper = registerWrapper;
function unregisterWrapper(id) {
    libWrapper.unregister(module_1.MODULE.id, id);
}
exports.unregisterWrapper = unregisterWrapper;
function createWrapper(path, callback, options = {}) {
    let wrapperId = null;
    return {
        activate() {
            if (wrapperId !== null)
                return;
            // @ts-ignore
            wrapperId = registerWrapper(path, callback, options.type ?? "WRAPPER", options.context);
            options.onActivate?.();
        },
        disable() {
            if (wrapperId === null)
                return;
            unregisterWrapper(wrapperId);
            wrapperId = null;
            options.onDisable?.();
        },
        toggle(enabled) {
            if (enabled)
                this.activate();
            else
                this.disable();
        },
    };
}
exports.createWrapper = createWrapper;
