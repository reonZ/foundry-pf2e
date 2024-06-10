"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKeybind = void 0;
const module_1 = require("./module");
function registerKeybind(name, data) {
    game.keybindings.register(module_1.MODULE.id, name, {
        ...data,
        name: module_1.MODULE.path("keybindings", name, "name"),
        hint: module_1.MODULE.path("keybindings", name, "hint"),
    });
}
exports.registerKeybind = registerKeybind;
