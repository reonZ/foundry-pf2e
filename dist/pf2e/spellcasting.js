"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnInvalidDrop = exports.createCounteractStatistic = exports.coerceToSpellGroupId = void 0;
const classes_1 = require("../classes");
const misc_1 = require("./misc");
const R = __importStar(require("remeda"));
/** Try to coerce some value (typically from user input) to a slot group ID */
function coerceToSpellGroupId(value) {
    if (value === "cantrips")
        return value;
    const numericValue = Number(value) || NaN;
    return numericValue.between(1, 10) ? numericValue : null;
}
exports.coerceToSpellGroupId = coerceToSpellGroupId;
function warnInvalidDrop(warning, { spell, groupId }) {
    const localize = (0, misc_1.localizer)("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: (0, misc_1.ordinalString)(spell.baseRank),
        });
        const targetRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: (0, misc_1.ordinalString)(groupId),
        });
        ui.notifications.warn(localize("InvalidRank", { spell: spell.name, spellRank, targetRank }));
    }
    else if (warning === "cantrip-mismatch") {
        const locKey = spell.isCantrip ? "CantripToRankedSlots" : "NonCantripToCantrips";
        ui.notifications.warn(localize(locKey, { spell: spell.name }));
    }
    else if (warning === "invalid-spell") {
        const type = game.i18n.format("PF2E.TraitFocus");
        ui.notifications.warn(localize("WrongSpellType", { type }));
    }
}
exports.warnInvalidDrop = warnInvalidDrop;
function createCounteractStatistic(ability) {
    const actor = ability.actor;
    // NPCs have neither a proficiency bonus nor specified attribute modifier: use their base attack roll modifier
    const baseModifier = actor.isOfType("npc")
        ? ability.statistic.check.modifiers
            .find((m) => m.type === "untyped" && m.slug === "base")
            ?.clone()
        : null;
    const Statistic = (0, classes_1.getStatisticClass)(actor.skills.acrobatics);
    return new Statistic(actor, {
        slug: "counteract",
        label: "PF2E.Item.Spell.Counteract.Label",
        attribute: ability.statistic.attribute,
        rank: ability.statistic.rank || 1,
        check: { type: "check", modifiers: R.filter([baseModifier], R.isTruthy) },
    });
}
exports.createCounteractStatistic = createCounteractStatistic;
