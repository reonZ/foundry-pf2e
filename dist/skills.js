"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslatedSkills = void 0;
let TRANSLATED_SKILL;
function getTranslatedSkills() {
    if (!TRANSLATED_SKILL) {
        TRANSLATED_SKILL = {};
        for (const [key, value] of Object.entries(CONFIG.PF2E.skillList)) {
            TRANSLATED_SKILL[key] = game.i18n
                .localize(value)
                .toLocaleLowerCase(game.i18n.lang);
        }
    }
    return foundry.utils.deepClone(TRANSLATED_SKILL);
}
exports.getTranslatedSkills = getTranslatedSkills;
