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

    /** A formula prepared in a crafting ability whose item has been loaded */
    type PreparedFormula = Required<PreparedFormulaData> & CraftingFormula;

    interface CraftingAbilityData {
        slug: string;
        resource: string | null;
        label: string;
        isAlchemical: boolean;
        isDailyPrep: boolean;
        isPrepared: boolean;
        maxSlots: number | null;
        craftableItems: CraftableItemDefinition[];
        fieldDiscovery?: RawPredicate | null;
        batchSize: number;
        fieldDiscoveryBatchSize?: number;
        maxItemLevel: number;
        preparedFormulaData: PreparedFormulaData[];
    }

    interface CraftableItemDefinition {
        predicate: Predicate;
        batchSize?: number;
    }

    interface CraftingAbility extends CraftingAbilityData {
        /** A label for this crafting entry to display on sheets */
        label: string;

        slug: string;
        resource: string | null;

        /** This crafting ability's parent actor */
        actor: CharacterPF2e;

        preparedFormulaData: PreparedFormulaData[];
        isAlchemical: boolean;
        isDailyPrep: boolean;
        isPrepared: boolean;
        maxSlots: number;
        fieldDiscovery: Predicate | null;
        fieldDiscoveryBatchSize: number;
        batchSize: number;
        maxItemLevel: number;
        /** All craftable item definitions, sorted from biggest batch to smallest batch size */
        craftableItems: CraftableItemDefinition[];

        calculateReagentCost(): Promise<number>;
        getPreparedCraftingFormulas(): Promise<PreparedCraftingFormula[]>;
        calculateResourceCost(): Promise<number>;
    }

    /** Caches and performs operations on elements related to crafting */
    class CharacterCrafting {
        constructor(actor: CharacterPF2e);

        actor: CharacterPF2e;
        abilities: Collection<CraftingAbility>;

        getFormulas(): Promise<CraftingFormula[]>;
        performDailyCrafting(): Promise<void>;
    }
}
