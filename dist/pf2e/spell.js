"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellSlotGroupIdToNumber = exports.MAGIC_TRADITIONS = exports.EFFECT_AREA_SHAPES = void 0;
const EFFECT_AREA_SHAPES = [
    "burst",
    "cone",
    "cube",
    "cylinder",
    "emanation",
    "line",
    "square",
];
exports.EFFECT_AREA_SHAPES = EFFECT_AREA_SHAPES;
const MAGIC_TRADITIONS = new Set(["arcane", "divine", "occult", "primal"]);
exports.MAGIC_TRADITIONS = MAGIC_TRADITIONS;
function spellSlotGroupIdToNumber(groupId) {
    if (groupId === "cantrips")
        return 0;
    const numericValue = Number(groupId ?? NaN);
    return numericValue.between(0, 10) ? numericValue : null;
}
exports.spellSlotGroupIdToNumber = spellSlotGroupIdToNumber;
