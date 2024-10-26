"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollInitiative = exports.hasRolledInitiative = void 0;
const pf2e_1 = require("./pf2e");
function hasRolledInitiative(combatant) {
    return typeof combatant.initiative === "number";
}
exports.hasRolledInitiative = hasRolledInitiative;
function rollInitiative(actor, statistic, event) {
    const args = (0, pf2e_1.eventToRollParams)(event, { type: "check" });
    if (!statistic) {
        return actor.initiative?.roll(args);
    }
    const ActorInit = actor.initiative?.constructor;
    if (!ActorInit)
        return;
    const initiative = new ActorInit(actor, {
        statistic,
        tiebreakPriority: actor.system.initiative.tiebreakPriority,
    });
    initiative.roll(args);
}
exports.rollInitiative = rollInitiative;
