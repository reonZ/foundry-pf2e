"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollInitiative = void 0;
async function rollInitiative(actor, statistic, args = {}) {
    // Get or create the combatant
    const CombatantPF2e = getDocumentClass("Combatant");
    const combatant = args.combatant?.actor === actor
        ? args.combatant
        : await CombatantPF2e.fromActor(actor, false);
    if (!combatant)
        return null;
    if (combatant.hidden) {
        args.rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
    }
    const roll = await statistic.roll(args);
    if (!roll) {
        // Render combat sidebar in case a combatant was created but the roll was not completed
        game.combats.render(false);
        return null;
    }
    // Update the tracker unless requested not to
    const updateTracker = args.updateTracker ?? true;
    if (updateTracker) {
        combatant.encounter.setInitiative(combatant.id, roll.total);
    }
    return { combatant, roll };
}
exports.rollInitiative = rollInitiative;
