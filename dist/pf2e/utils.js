"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traitSlugToObject = void 0;
const misc_1 = require("./misc");
function traitSlugToObject(trait, dictionary) {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if ((0, misc_1.objectHasKey)(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }
    return traitObject;
}
exports.traitSlugToObject = traitSlugToObject;
