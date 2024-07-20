import * as R from "remeda";

let TRANSLATED_SKILL: Record<SkillSlug, string> | undefined;
let TRANSLATED_SKILL_LOWER: Record<SkillSlug, string> | undefined;
function getTranslatedSkills(lowercase = false) {
    TRANSLATED_SKILL ??= R.mapValues(CONFIG.PF2E.skills, ({ label }) => game.i18n.localize(label));

    if (lowercase) {
        TRANSLATED_SKILL_LOWER ??= R.mapValues(TRANSLATED_SKILL, (value) =>
            value.toLocaleLowerCase(game.i18n.lang)
        );

        return foundry.utils.deepClone(TRANSLATED_SKILL_LOWER);
    }

    return foundry.utils.deepClone(TRANSLATED_SKILL);
}

export { getTranslatedSkills };
