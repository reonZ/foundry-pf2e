export {};

declare global {
    class AbilitySheetPF2e extends ItemSheetPF2e<AbilityItemPF2e> {}

    interface AbilitySheetData extends ItemSheetDataPF2e<AbilityItemPF2e> {
        categories: ConfigPF2e["PF2E"]["actionCategories"];
        actionTypes: ConfigPF2e["PF2E"]["actionTypes"];
        actionsNumber: ConfigPF2e["PF2E"]["actionsNumber"];
        actionTraits: ConfigPF2e["PF2E"]["actionTraits"];
        frequencies: ConfigPF2e["PF2E"]["frequencies"];
        skills: ConfigPF2e["PF2E"]["skillList"];
        proficiencies: ConfigPF2e["PF2E"]["proficiencyLevels"];
        selfEffect: SelfEffectReference | null;
    }
}
