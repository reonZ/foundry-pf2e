let TRANSLATED_SKILL: Record<SkillSlug, string> | undefined;
function getTranslatedSkills() {
    if (!TRANSLATED_SKILL) {
        TRANSLATED_SKILL = {} as Record<SkillSlug, string>;

        for (const [key, value] of Object.entries(CONFIG.PF2E.skillList)) {
            TRANSLATED_SKILL[key as SkillSlug] = game.i18n
                .localize(value)
                .toLocaleLowerCase(game.i18n.lang);
        }
    }
    return foundry.utils.deepClone(TRANSLATED_SKILL);
}

export { getTranslatedSkills };
