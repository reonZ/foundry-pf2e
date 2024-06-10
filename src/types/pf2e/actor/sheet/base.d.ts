export {};

declare global {
    interface SheetItemList {
        label: string;
        types: string[];
        items: InventoryItem[];
    }

    interface InventoryItem<TItem extends PhysicalItemPF2e = PhysicalItemPF2e> {
        item: TItem;
        /** Item size if it causes any weight difference relative to the actor */
        itemSize?: ActorSizePF2e | null;
        isContainer: boolean;
        canBeEquipped: boolean;
        /** Bulk for each item is shown on an individual basis from merchant sheets */
        unitBulk: string | null;
        isInvestable: boolean;
        isSellable: boolean;
        hasCharges: boolean;
        heldItems?: InventoryItem[];
        notifyInvestment?: boolean;
        /** Whether the item should be hidden if the user isn't the owner */
        hidden: boolean;
    }

    interface SheetInventory {
        sections: SheetItemList[];
        bulk: InventoryBulk;
        showValueAlways: boolean;
        showUnitBulkPrice: boolean;
        hasStowingContainers: boolean;
        invested?: { value: number; max: number } | null;
    }

    interface CoinDisplayData {
        value: number;
        label: string;
    }

    type CoinageSummary = { [K in keyof Coins]?: CoinDisplayData };

    interface ActorSheetDataPF2e<TActor extends ActorPF2e> extends ActorSheetData<TActor> {
        data: TActor["system"];
        canDistributeCoins?: { enabled: boolean } | null;
        enrichedContent: Record<string, string>;
        inventory: SheetInventory;
        isLootSheet: boolean;
        isTargetFlatFooted: boolean;
        toggles: Record<string, RollOptionToggle[]>;
        totalCoinage: CoinageSummary;
        totalCoinageGold: string;
        totalWealth: Coins;
        totalWealthGold: string;
        traits: SheetOptions;
        user: { isGM: boolean };
        publicationLicenses: FormSelectOption[];
    }

    interface AbilityViewData {
        _id: string;
        name: string;
        traits: TraitViewData[];
        glyph: string | null;
        has: {
            aura: boolean;
            deathNote: boolean;
            selfEffect: boolean;
        };
    }

    interface ActorSheetRenderOptionsPF2e extends RenderOptions {
        /** What tab to switch to when rendering the sheet */
        tab?: string;
    }

    class ItemSummaryRenderer<
        TActor extends ActorPF2e,
        TSheet extends Application & { get actor(): TActor }
    > {
        toggleSummary(
            element: HTMLElement,
            options?: { visible?: boolean; instant?: boolean }
        ): Promise<void>;
        getItemFromElement(element: HTMLElement): Promise<ClientDocument | null>;
        renderItemSummary(
            container: HTMLElement,
            item: ItemPF2e<ActorPF2e>,
            chatData: RawItemChatData
        ): Promise<void>;
    }

    abstract class ActorSheetPF2e<TActor extends ActorPF2e = ActorPF2e> extends ActorSheet<
        TActor,
        ItemPF2e
    > {
        itemRenderer: ItemSummaryRenderer<TActor, ActorSheetPF2e<TActor>>;

        prepareInventory(): SheetInventory;
        deleteItem<TItem extends ItemPF2e>(
            item: TItem,
            event?: MouseEvent
        ): Promise<TItem | undefined>;
    }

    interface ActorSheetPF2e<TActor extends ActorPF2e = ActorPF2e>
        extends ActorSheet<TActor, ItemPF2e> {
        prepareItems?(sheetData: ActorSheetDataPF2e<TActor>): Promise<void>;
        render(force?: boolean, options?: ActorSheetRenderOptionsPF2e): this;
    }
}
