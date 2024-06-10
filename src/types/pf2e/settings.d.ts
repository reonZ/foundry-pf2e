export {};

declare global {
    interface ClientSettings {
        get(
            module: "pf2e",
            setting: "automation.actorsDeadAtZero"
        ): "neither" | "npcsOnly" | "pcsOnly" | "both";
        get(module: "pf2e", setting: "automation.effectExpiration"): boolean;
        get(module: "pf2e", setting: "automation.encumbrance"): boolean;
        get(module: "pf2e", setting: "automation.flankingDetection"): boolean;
        get(module: "pf2e", setting: "automation.iwr"): boolean;
        get(module: "pf2e", setting: "automation.lootableNPCs"): boolean;
        get(module: "pf2e", setting: "automation.removeExpiredEffects"): boolean;
        get(module: "pf2e", setting: "automation.rulesBasedVision"): boolean;

        get(module: "pf2e", setting: "gradualBoostsVariant"): boolean;
        get(
            module: "pf2e",
            setting: "automaticBonusVariant"
        ): "noABP" | "ABPFundamentalPotency" | "ABPRulesAsWritten";
        get(module: "pf2e", setting: "freeArchetypeVariant"): boolean;
        get(module: "pf2e", setting: "proficiencyVariant"): boolean;
        get(module: "pf2e", setting: "staminaVariant"): boolean;

        get(module: "pf2e", setting: "proficiencyUntrainedModifier"): number;
        get(module: "pf2e", setting: "proficiencyTrainedModifier"): number;
        get(module: "pf2e", setting: "proficiencyExpertModifier"): number;
        get(module: "pf2e", setting: "proficiencyMasterModifier"): number;
        get(module: "pf2e", setting: "proficiencyLegendaryModifier"): number;

        get(module: "pf2e", setting: "metagame_partyVision"): boolean;
        get(module: "pf2e", setting: "metagame_secretCondition"): boolean;
        get(module: "pf2e", setting: "metagame_secretDamage"): boolean;
        get(module: "pf2e", setting: "metagame_showBreakdowns"): boolean;
        get(module: "pf2e", setting: "metagame_showDC"): boolean;
        get(module: "pf2e", setting: "metagame_showPartyStats"): boolean;
        get(module: "pf2e", setting: "metagame_showResults"): boolean;
        get(module: "pf2e", setting: "metagame_tokenSetsNameVisibility"): boolean;
        get(module: "pf2e", setting: "metagame_secretChecks"): boolean;

        get(module: "pf2e", setting: "tokens.autoscale"): boolean;

        get(module: "pf2e", setting: "worldClock.dateTheme"): "AR" | "IC" | "AD" | "CE";
        get(module: "pf2e", setting: "worldClock.playersCanView"): boolean;
        get(module: "pf2e", setting: "worldClock.showClockButton"): boolean;
        get(module: "pf2e", setting: "worldClock.syncDarkness"): boolean;
        get(module: "pf2e", setting: "worldClock.timeConvention"): 24 | 12;
        get(module: "pf2e", setting: "worldClock.worldCreatedOn"): string;

        get(module: "pf2e", setting: "campaignFeats"): boolean;
        get(module: "pf2e", setting: "campaignFeatSections"): FeatGroupOptions[];
        get(module: "pf2e", setting: "campaignType"): string;

        get(module: "pf2e", setting: "activeParty"): string;
        get(module: "pf2e", setting: "activePartyFolderState"): boolean;
        get(module: "pf2e", setting: "createdFirstParty"): boolean;

        // get(module: "pf2e", setting: "homebrew.languages"): HomebrewTag<"languages">[];
        // get(module: "pf2e", setting: "homebrew.weaponCategories"): HomebrewTag<"weaponCategories">[];
        // get(module: "pf2e", setting: HomebrewTraitSettingsKey): HomebrewTag[];
        // get(module: "pf2e", setting: "homebrew.damageTypes"): CustomDamageData[];
        get(module: "pf2e", setting: "homebrew.languageRarities"): LanguageSettings;

        // get(module: "pf2e", setting: "compendiumBrowserPacks"): CompendiumBrowserSettings;
        // get(module: "pf2e", setting: "compendiumBrowserSources"): CompendiumBrowserSources;
        get(module: "pf2e", setting: "critFumbleButtons"): boolean;
        get(module: "pf2e", setting: "critRule"): "doubledamage" | "doubledice";
        get(module: "pf2e", setting: "deathIcon"): ImageFilePath;
        get(module: "pf2e", setting: "drawCritFumble"): boolean;
        get(module: "pf2e", setting: "enabledRulesUI"): boolean;
        get(module: "pf2e", setting: "gmVision"): boolean;
        get(module: "pf2e", setting: "identifyMagicNotMatchingTraditionModifier"): 0 | 2 | 5 | 10;
        get(module: "pf2e", setting: "nathMode"): boolean;
        get(module: "pf2e", setting: "seenRemasterJournalEntry"): boolean;
        // get(module: "pf2e", setting: "statusEffectType"): StatusEffectIconTheme;
        get(module: "pf2e", setting: "totmToggles"): boolean;
        get(module: "pf2e", setting: "worldSchemaVersion"): number;
        get(module: "pf2e", setting: "worldSystemVersion"): string;
    }
}
