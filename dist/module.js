"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveModule = exports.MODULE = void 0;
const utils_1 = require("./utils");
let MODULE_ID = "";
let MODULE_NAME = "";
const MODULE = {
    get id() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_ID;
    },
    get name() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_NAME;
    },
    get current() {
        return game.modules.get(this.id);
    },
    throwError(str) {
        throw new Error(`\n[${this.name}] ${str}`);
    },
    error(str, error) {
        let message = `[${this.name}] ${str}`;
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        else if (typeof error === "string") {
            message += `\n${error}`;
        }
        console.error(message);
    },
    log(str) {
        console.log(`[${this.name}] ${str}`);
    },
    path(...path) {
        return `${this.id}.${(0, utils_1.joinStr)(".", ...path)}`;
    },
    register(id, name) {
        if (MODULE_ID) {
            throw new Error("Module was already registered.");
        }
        MODULE_ID = id;
        MODULE_NAME = name;
    },
};
exports.MODULE = MODULE;
function getActiveModule(name) {
    const module = game.modules.get(name);
    if (!module?.active)
        return;
    module.getSetting = (key) => game.settings.get(name, key);
    return module?.active ? module : undefined;
}
exports.getActiveModule = getActiveModule;
