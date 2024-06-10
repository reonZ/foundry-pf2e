"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRolledInitiative = void 0;
function hasRolledInitiative(combatant) {
    return typeof combatant.initiative === "number";
}
exports.hasRolledInitiative = hasRolledInitiative;
