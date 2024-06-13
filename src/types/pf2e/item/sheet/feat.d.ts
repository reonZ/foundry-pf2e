export {};

declare global {
    class FeatSheetPF2e extends ItemSheetPF2e<FeatPF2e> {}

    interface FeatSheetData extends ItemSheetDataPF2e<FeatPF2e> {
        actionsNumber: typeof CONFIG.PF2E.actionsNumber;
        actionTypes: typeof CONFIG.PF2E.actionTypes;
        acuityOptions: typeof CONFIG.PF2E.senseAcuities;
        attributes: typeof CONFIG.PF2E.abilities;
        canHaveKeyOptions: boolean;
        categories: typeof CONFIG.PF2E.featCategories;
        frequencies: typeof CONFIG.PF2E.frequencies;
        hasLanguages: boolean;
        hasLineageTrait: boolean;
        hasProficiencies: boolean;
        hasSenses: boolean;
        languages: LanguageOptions;
        mandatoryTakeOnce: boolean;
        maxTakableOptions: FormSelectOption[];
        proficiencies: ProficiencyOptions;
        proficiencyRankOptions: Record<string, string>;
        selfEffect: SelfEffectReference | null;
        senses: SenseOption[];
        showPrerequisites: boolean;
    }

    interface LanguageOptions {
        slots: number;
        granted: {
            available: { slug: Language; label: string }[];
            selected: { slug: Language; label: string }[];
        };
    }

    interface ProficiencyOptions {
        other: ProficiencyOptionGroup<null>;
        saves: ProficiencyOptionGroup;
        attacks: ProficiencyOptionGroup;
        defenses: ProficiencyOptionGroup;
        classes: ProficiencyOptionGroup;
    }

    interface ProficiencyOptionGroup<TGroup extends string | null = string> {
        group: TGroup;
        options: { slug: string; label: string; rank: OneToFour | null }[];
    }

    interface SenseOption {
        acuity?: SenseAcuity | null;
        canSetAcuity: boolean;
        canSetRange: boolean;
        label: string;
        range?: number | null;
        selected: boolean;
        slug: string;
        special: { ancestry: boolean; second: boolean } | null;
    }
}
