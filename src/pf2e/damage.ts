import { isInstanceOf } from "../object";
import { fontAwesomeIcon } from "./misc";

const DAMAGE_TYPE_ICONS: Record<DamageType, string | null> = {
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

function damageDiceIcon(
    roll: DamageRoll | DamageInstance,
    { fixedWidth = false } = {}
): HTMLElement {
    // Special case: an `IntermediateDie` with deterministic faces
    const firstTerm =
        isInstanceOf(roll, "DamageRoll") &&
        isInstanceOf<IntermediateDie>(roll.instances[0]?.head, "IntermediateDie")
            ? roll.instances[0]?.head
            : null;
    if (
        firstTerm?.faces instanceof foundry.dice.terms.NumericTerm &&
        [4, 8, 6, 10, 12].includes(firstTerm.faces.number)
    ) {
        return fontAwesomeIcon(`dice-d${firstTerm.faces.number}`, { fixedWidth });
    }

    const firstDice = roll.dice.at(0);
    const glyph =
        firstDice instanceof foundry.dice.terms.Die && [4, 8, 6, 10, 12].includes(firstDice.faces)
            ? `dice-d${firstDice.faces}`
            : firstDice
            ? "dice-d20"
            : "calculator";

    return fontAwesomeIcon(glyph, { fixedWidth });
}

export { DAMAGE_TYPE_ICONS, damageDiceIcon };
