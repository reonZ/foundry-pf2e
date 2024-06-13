export {};

declare global {
    type PhysicalItemSource =
        | ArmorSource
        | BookSource
        | ConsumableSource
        | ContainerSource
        | EquipmentSource
        | ShieldSource
        | TreasureSource
        | WeaponSource;

    type ItemSourcePF2e =
        | PhysicalItemSource
        | AbilitySource
        | AfflictionSource
        | AncestrySource
        | BackgroundSource
        | CampaignFeatureSource
        | ClassSource
        | ConditionSource
        | DeitySource
        | EffectSource
        | FeatSource
        | HeritageSource
        | KitSource
        | LoreSource
        | MeleeSource
        | SpellSource
        | SpellcastingEntrySource;

    interface ItemInstances<TParent extends ActorPF2e | null> {
        action: AbilityItemPF2e<TParent>;
        affliction: AfflictionPF2e<TParent>;
        ancestry: AncestryPF2e<TParent>;
        armor: ArmorPF2e<TParent>;
        background: BackgroundPF2e<TParent>;
        backpack: ContainerPF2e<TParent>;
        book: BookPF2e<TParent>;
        campaignFeature: CampaignFeaturePF2e<TParent>;
        class: ClassPF2e<TParent>;
        condition: ConditionPF2e<TParent>;
        consumable: ConsumablePF2e<TParent>;
        deity: DeityPF2e<TParent>;
        effect: EffectPF2e<TParent>;
        equipment: EquipmentPF2e<TParent>;
        feat: FeatPF2e<TParent>;
        heritage: HeritagePF2e<TParent>;
        kit: KitPF2e<TParent>;
        lore: LorePF2e<TParent>;
        melee: MeleePF2e<TParent>;
        shield: ShieldPF2e<TParent>;
        spell: SpellPF2e<TParent>;
        spellcastingEntry: SpellcastingEntryPF2e<TParent>;
        treasure: TreasurePF2e<TParent>;
        weapon: WeaponPF2e<TParent>;
    }

    type NonPhysicalItemType =
        | "action"
        | "affliction"
        | "ancestry"
        | "background"
        | "campaignFeature"
        | "class"
        | "condition"
        | "deity"
        | "effect"
        | "feat"
        | "heritage"
        | "kit"
        | "lore"
        | "melee"
        | "spell"
        | "spellcastingEntry";

    type ItemType = NonPhysicalItemType | PhysicalItemType;

    interface EnrichmentOptionsPF2e extends EnrichmentOptions {
        rollData?: RollDataPF2e;
        /** Whether to run the enriched string through `UserVisibility.process` */
        processVisibility?: boolean;
    }

    interface TraitChatData {
        value: string;
        label: string;
        description?: string;
        mystified?: boolean;
        excluded?: boolean;
    }

    interface RawItemChatData {
        [key: string]: unknown;
        description: ItemDescriptionData;
        traits?: TraitChatData[];
        properties?: string[];
    }

    class ItemPF2e<TParent extends ActorPF2e | null = ActorPF2e | null> extends Item<TParent> {
        get slug(): string | null;
        get description(): string;

        getOriginData(): ItemOriginFlag;
        getRollOptions(prefix?: string, options?: { includeGranter?: boolean }): string[];

        isOfType<T extends ItemType>(...types: T[]): this is ItemInstances<TParent>[T];
        isOfType(type: "physical"): this is PhysicalItemPF2e<TParent>;
        isOfType<T extends "physical" | ItemType>(
            ...types: T[]
        ): this is T extends "physical"
            ? PhysicalItemPF2e<TParent>
            : T extends ItemType
            ? ItemInstances<TParent>[T]
            : never;
        isOfType(...types: string[]): boolean;

        toMessage(
            event?: Maybe<Event | JQuery.TriggeredEvent>,
            options?: {
                rollMode?: RollMode | "roll";
                create?: boolean;
                data?: Record<string, unknown>;
            }
        ): Promise<ChatMessagePF2e | undefined>;

        getChatData(
            htmlOptions?: EnrichmentOptionsPF2e,
            _rollOptions?: Record<string, unknown>
        ): Promise<RawItemChatData>;
    }

    interface ItemPF2e<TParent extends ActorPF2e | null = ActorPF2e | null> extends Item<TParent> {
        constructor: typeof ItemPF2e;
        flags: ItemFlagsPF2e;
        readonly _source: ItemSourcePF2e;
        system: ItemSystemData;

        _sheet: ItemSheetPF2e<this> | null;

        get sheet(): ItemSheetPF2e<this>;
        get sourceId(): ItemUUID | null;

        prepareSiblingData?(this: ItemPF2e<ActorPF2e>): void;
        prepareActorData?(this: ItemPF2e<ActorPF2e>): void;
        /** Optional data-preparation callback executed after rule-element synthetics are prepared */
        onPrepareSynthetics?(this: ItemPF2e<ActorPF2e>): void;

        /** Returns items that should also be added when this item is created */
        createGrantedItems?(options?: object): Promise<ItemPF2e[]>;

        /** Returns items that should also be deleted should this item be deleted */
        getLinkedItems?(): ItemPF2e<ActorPF2e>[];
    }
}
