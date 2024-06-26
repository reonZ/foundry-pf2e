"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.damageDiceIcon = exports.DAMAGE_TYPE_ICONS = void 0;
const object_1 = require("../object");
const misc_1 = require("./misc");
const DAMAGE_TYPE_ICONS = {
    bleed: "droplet",
    acid: "vial",
    bludgeoning: "hammer",
    cold: "snowflake",
    electricity: "bolt",
    fire: "fire",
    force: "sparkles",
    mental: "brain",
    piercing: "bow-arrow",
    poison: "spider",
    slashing: "axe",
    sonic: "waveform-lines",
    spirit: "ghost",
    vitality: "sun",
    void: "skull",
    untyped: null,
};
exports.DAMAGE_TYPE_ICONS = DAMAGE_TYPE_ICONS;
function damageDiceIcon(roll, { fixedWidth = false } = {}) {
    // Special case: an `IntermediateDie` with deterministic faces
    const firstTerm = (0, object_1.isInstanceOf)(roll, "DamageRoll") &&
        (0, object_1.isInstanceOf)(roll.instances[0]?.head, "IntermediateDie")
        ? roll.instances[0]?.head
        : null;
    if (firstTerm?.faces instanceof foundry.dice.terms.NumericTerm &&
        [4, 8, 6, 10, 12].includes(firstTerm.faces.number)) {
        return (0, misc_1.fontAwesomeIcon)(`dice-d${firstTerm.faces.number}`, { fixedWidth });
    }
    const firstDice = roll.dice.at(0);
    const glyph = firstDice instanceof foundry.dice.terms.Die && [4, 8, 6, 10, 12].includes(firstDice.faces)
        ? `dice-d${firstDice.faces}`
        : firstDice
            ? "dice-d20"
            : "calculator";
    return (0, misc_1.fontAwesomeIcon)(glyph, { fixedWidth });
}
exports.damageDiceIcon = damageDiceIcon;
