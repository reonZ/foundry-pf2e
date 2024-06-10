"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSpells = exports.getRankLabel = void 0;
const pf2e_1 = require("./pf2e");
function hasSpells(actor) {
    return (actor.isOfType("character", "npc") &&
        actor.spellcasting.contents.some((entry) => (entry.spells?.size && entry.spells?.size > 0) ||
            (entry.isEphemeral && entry.id.endsWith("-casting"))));
}
exports.hasSpells = hasSpells;
function getRankLabel(rank) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: (0, pf2e_1.ordinalString)(rank),
    });
}
exports.getRankLabel = getRankLabel;
