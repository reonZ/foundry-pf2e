export {};

declare global {
    class ItemSheetPF2e<TItem extends ItemPF2e = ItemPF2e> extends ItemSheet<
        TItem,
        ItemSheetOptions
    > {}

    interface ItemSheetDataPF2e<TItem extends ItemPF2e> extends ItemSheetData<TItem> {
        /** The item type label that shows at the top right (for example, "Feat" for "Feat 6") */
        itemType: string | null;
        showTraits: boolean;
        /** The sidebar's current title */
        sidebarTitle: string;
        sidebarTemplate: string | null;
        detailsTemplate: string;
        item: TItem;
        data: TItem["system"];
        fieldIdPrefix: string;
        enrichedContent: Record<string, string>;
        isPhysical: boolean;
        user: { isGM: boolean };
        enabledRulesUI: boolean;
        ruleEditing: boolean;
        rarity: Rarity | null;
        rarities: typeof CONFIG.PF2E.rarityTraits;
        traits: SheetOptions | null;
        traitTagifyData: TraitTagifyEntry[] | null;
        rules: {
            selection: {
                selected: string | null;
                types: Record<string, string>;
            };
            elements: {
                template: string;
            }[];
        };
        publicationLicenses: FormSelectOption[];
        /** Lore only, will be removed later */
        proficiencyRanks: typeof CONFIG.PF2E.proficiencyLevels;
    }

    interface ItemSheetOptions extends DocumentSheetOptions {
        hasSidebar: boolean;
    }
}
