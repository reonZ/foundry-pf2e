export {};

declare global {
    interface CraftingEntryData {
        selector: string;
        name: string;
        item: ItemPF2e<CharacterPF2e>;
        isAlchemical: boolean;
        isDailyPrep: boolean;
        isPrepared: boolean;
        maxSlots?: number;
        craftableItems: RawPredicate;
        fieldDiscovery?: RawPredicate | null;
        batchSizes?: { default: number; other: { definition: RawPredicate; quantity: number }[] };
        fieldDiscoveryBatchSize?: number;
        maxItemLevel: number;
        preparedFormulaData?: PreparedFormulaData[];
    }

    interface PreparedFormulaData {
        itemUUID: string;
        quantity?: number;
        expended?: boolean;
        isSignatureItem?: boolean;
        sort?: number;
    }

    interface PreparedCraftingFormula extends CraftingFormula {
        quantity: number;
        expended: boolean;
        isSignatureItem: boolean;
        sort: number;
    }

    interface PreparedFormulaSheetData {
        uuid: string;
        expended: boolean;
        img: ImageFilePath;
        name: string;
        quantity: number;
        isSignatureItem: boolean;
    }

    interface CharacterCraftingData {
        formulas: CraftingFormulaData[];
        entries: Record<string, Partial<CraftingEntryData>>;
    }

    interface CraftingFormula extends CraftingFormulaData {
        /** The item to craft */
        item: PhysicalItemPF2e;
        /** The difficulty class to craft this item */
        dc: number;
        /** Some items can be created in multiples with a single crafting check */
        batchSize: number;
        /** Whether or not this formula is saved directly on the actor and can be deleted */
        deletable: boolean;
    }

    interface CraftingAbilityData {
        selector: string;
        name: string;
        isAlchemical: boolean;
        isDailyPrep: boolean;
        isPrepared: boolean;
        maxSlots?: number;
        craftableItems: RawPredicate;
        fieldDiscovery?: RawPredicate | null;
        batchSizes?: { default: number; other: { definition: RawPredicate; quantity: number }[] };
        fieldDiscoveryBatchSize?: number;
        maxItemLevel?: number | null;
        preparedFormulaData?: PreparedFormulaData[];
    }

    interface CraftingAbility extends CraftingAbilityData {
        calculateReagentCost(): Promise<number>;
        getPreparedCraftingFormulas(): Promise<PreparedCraftingFormula[]>;
    }

    /** Caches and performs operations on elements related to crafting */
    class CharacterCrafting {
        constructor(actor: CharacterPF2e);

        actor: CharacterPF2e;
        abilities: CraftingAbility[];

        #formulas: CraftingFormula[] | null;
    }
}
