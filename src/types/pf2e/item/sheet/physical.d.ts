export {};

declare global {
    interface PhysicalItemSheetData<TItem extends PhysicalItemPF2e = PhysicalItemPF2e>
        extends ItemSheetDataPF2e<TItem> {
        sidebarTemplate: string;
        isApex: boolean;
        isPhysical: true;
        bulkAdjustment: string | null;
        adjustedBulkHint?: string | null;
        adjustedLevelHint: string | null;
        basePrice: CoinsPF2e;
        priceAdjustment: string | null;
        adjustedPriceHint: string | null;
        attributes: typeof CONFIG.PF2E.abilities;
        actionTypes: typeof CONFIG.PF2E.actionTypes;
        actionsNumber: typeof CONFIG.PF2E.actionsNumber;
        bulks: { value: number; label: string }[];
        frequencies: typeof CONFIG.PF2E.frequencies;
        sizes: Omit<typeof CONFIG.PF2E.actorSizes, "sm">;
        usages: typeof CONFIG.PF2E.usages;
        usageOptions: FormSelectOption[];
        identificationStatusOptions: FormSelectOption[];
        bulkDisabled: boolean;
        activations: {
            action: ItemActivation;
            id: string;
            base: string;
            description: string;
            traits: SheetOptions;
        }[];
    }

    interface MaterialSheetEntry {
        value: string;
        label: string;
        group: string;
    }

    interface MaterialSheetData {
        value: string;
        materials: MaterialSheetEntry[];
    }

    class PhysicalItemSheetPF2e<
        TItem extends PhysicalItemPF2e = PhysicalItemPF2e
    > extends ItemSheetPF2e<TItem> {}
}
