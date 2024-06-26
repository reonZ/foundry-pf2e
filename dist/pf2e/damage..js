"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.damageDiceIcon = void 0;
function damageDiceIcon(roll, { fixedWidth = false } = {}) {
    // Special case: an `IntermediateDie` with deterministic faces
    const firstTerm = roll instanceof DamageRoll && roll.instances[0]?.head instanceof IntermediateDie
        ? roll.instances[0]?.head
        : null;
    if (firstTerm?.faces instanceof foundry.dice.terms.NumericTerm &&
        [4, 8, 6, 10, 12].includes(firstTerm.faces.number)) {
        return fontAwesomeIcon(`dice-d${firstTerm.faces.number}`, { fixedWidth });
    }
    const firstDice = roll.dice.at(0);
    const glyph = firstDice instanceof foundry.dice.terms.Die && [4, 8, 6, 10, 12].includes(firstDice.faces)
        ? `dice-d${firstDice.faces}`
        : firstDice
            ? "dice-d20"
            : "calculator";
    return fontAwesomeIcon(glyph, { fixedWidth });
}
exports.damageDiceIcon = damageDiceIcon;
