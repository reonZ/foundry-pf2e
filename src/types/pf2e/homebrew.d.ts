export {};

declare global {
    type LanguageSettingsSchema = {
        /** The "common" tongue of the region, rather than languages of common rarity */
        commonLanguage: foundry.data.fields.StringField<
            LanguageNotCommon,
            LanguageNotCommon,
            true,
            true,
            true
        >;
        /** Languages of uncommon rarity */
        uncommon: LanguageSetField;
        /** Languages of rare rarity */
        rare: LanguageSetField;
        /** "Secret" languages (Wildsong) */
        secret: LanguageSetField;
        /** Languages not available for use on any creature */
        unavailable: LanguageSetField;
    };

    type LanguageNotCommon = Exclude<Language, "common">;

    type LanguageSetField = foundry.data.fields.SetField<
        foundry.data.fields.StringField<LanguageNotCommon, LanguageNotCommon, true, false, false>,
        LanguageNotCommon[],
        Set<LanguageNotCommon>,
        true,
        false,
        true
    >;

    class LanguageSettings extends foundry.abstract.DataModel<null, LanguageSettingsSchema> {}
}
