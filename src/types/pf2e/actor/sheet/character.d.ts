export {};

declare global {
    interface CraftingAbilitySheetData {
        slug: string;
        label: string;
        isAlchemical: boolean;
        isPrepared: boolean;
        isDailyPrep: boolean;
        maxSlots: number;
        maxItemLevel: number;
        reagentCost: number;
        remainingSlots: number;
        prepared: PreparedFormula[];
    }

    interface CraftingEntriesSheetData {
        dailyCrafting: boolean;
        other: CraftingAbilitySheetData[];
        alchemical: {
            entries: CraftingAbilitySheetData[];
            totalReagentCost: number;
            infusedReagents: {
                value: number;
                max: number;
            };
        };
    }

    interface CraftingSheetData {
        noCost: boolean;
        hasQuickAlchemy: boolean;
        knownFormulas: Record<number, CraftingFormula[]>;
        entries: CraftingEntriesSheetData;
    }

    type CharacterSheetTabVisibility = {
        effects: boolean;
        character: boolean;
        spellcasting: boolean;
        crafting: boolean;
        proficiencies: boolean;
        pfs: boolean;
        biography: boolean;
        inventory: boolean;
        feats: boolean;
        actions: boolean;
    };

    type SpellcastingTabSlug = "known-spells" | "rituals" | "activations";

    interface ClassDCSheetData extends ClassDCData {
        icon: string;
        hover: string;
    }

    interface ElementalBlastSheetConfig extends ElementalBlastConfig {
        damageType: DamageType;
        formula: {
            ranged: { damage: string | null; critical: string | null };
            melee: { damage: string | null; critical: string | null };
        };
    }

    type CharacterSystemSheetData = CharacterSystemData & {
        details: CharacterSystemData["details"] & {
            keyability: {
                value: keyof typeof CONFIG.PF2E.abilities;
                singleOption: boolean;
            };
        };
        resources: {
            heroPoints: {
                icon: string;
                hover: string;
            };
        };
        saves: Record<
            SaveType,
            CharacterSaveData & {
                rankName?: string;
                short?: string;
            }
        >;
    };

    type LanguageSheetData = {
        slug: Language | null;
        label: string;
        tooltip: string | null;
        overLimit: boolean;
    };

    interface SpeedSheetData {
        slug: string;
        icon: string;
        action: string | null;
        label: string;
        value: number | null;
        breakdown: string | null;
    }

    type CharacterSheetOptions = ActorSheetOptions;

    interface CharacterSheetData<TActor extends CharacterPF2e = CharacterPF2e>
        extends CreatureSheetData<TActor> {
        abpEnabled: boolean;
        ancestry: AncestryPF2e<CharacterPF2e> | null;
        heritage: HeritagePF2e<CharacterPF2e> | null;
        background: BackgroundPF2e<CharacterPF2e> | null;
        attributeBoostsAllocated: boolean;
        biography: CharacterBiography;
        class: ClassPF2e<CharacterPF2e> | null;
        numberToRank: Record<ZeroToFour, string>;
        classDCs: {
            dcs: ClassDCSheetData[];
            /** The slug of the character's primary class DC */
            primary: string | null;
            /** Show class label and individual modifier lists for each class DC */
            perDCDetails: boolean;
        };
        apexAttributeOptions: AttributeString[];
        crafting: CraftingSheetData;
        data: CharacterSystemSheetData;
        deity: DeityPF2e<CharacterPF2e> | null;
        hasStamina: boolean;
        /** This actor has actual containers for stowing, rather than just containers serving as a UI convenience */
        hasRealContainers: boolean;
        languages: LanguageSheetData[];
        magicTraditions: Record<MagicTradition, string>;
        martialProficiencies: Record<"attacks" | "defenses", Record<string, MartialProficiency>>;
        options: CharacterSheetOptions;
        preparationType: Object;
        showPFSTab: boolean;
        spellCollectionGroups: Record<SpellcastingTabSlug, SpellcastingSheetData[]>;
        hasNormalSpellcasting: boolean;
        tabVisibility: CharacterSheetTabVisibility;
        actions: {
            encounter: Record<
                "action" | "reaction" | "free",
                { label: string; actions: ActionSheetData[] }
            >;
            exploration: {
                active: ActionSheetData[];
                other: ActionSheetData[];
            };
            downtime: ActionSheetData[];
        };
        feats: FeatGroup[];
        elementalBlasts: ElementalBlastSheetConfig[];
        senses: Sense[];
        speeds: SpeedSheetData[];
    }

    interface ActionSheetData extends RawObject<AbilityItemPF2e> {
        id: string;
        actionCost: ActionCost | null;
        glyph: string | null;
        frequency: Frequency | null;
        hasEffect: boolean;
    }

    class CharacterSheetPF2e<
        TActor extends CharacterPF2e = CharacterPF2e
    > extends CreatureSheetPF2e<TActor> {
        getData(options?: ActorSheetOptions): Promise<CharacterSheetData<TActor>>;
    }
}
