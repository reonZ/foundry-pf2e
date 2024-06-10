"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHoldingModifierKeys = void 0;
function isHoldingModifierKeys(keys) {
    return keys.some((key) => game.keyboard.isModifierActive(key));
}
exports.isHoldingModifierKeys = isHoldingModifierKeys;
