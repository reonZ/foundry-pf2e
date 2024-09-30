export {};

declare global {
    interface BaseSpellcastingEntry<TActor extends ActorPF2e | null = ActorPF2e | null> {
        id: string;
        name: string;
        actor: TActor;
        sort: number;
        category: SpellcastingCategory;
        attribute?: Maybe<AttributeString>;
        isFlexible: boolean;
        isFocusPool: boolean;
        isInnate: boolean;
        isPrepared: boolean;
        isRitual: boolean;
        isSpontaneous: boolean;
        isEphemeral: boolean;
        statistic?: Statistic | null;
        /** A related but more-limited statistic for making counteract checks */
        counteraction?: Statistic | null;
        tradition: MagicTradition | null;
        spells: SpellCollection<NonNullable<TActor>> | null;
        system?: SpellcastingEntrySystemData;

        getSheetData(
            options?: GetSheetDataOptions<NonNullable<TActor>>
        ): Promise<SpellcastingSheetData>;
        getRollOptions?(prefix: "spellcasting"): string[];

        canCast(spell: SpellPF2e, options?: { origin?: PhysicalItemPF2e }): boolean;

        cast(spell: SpellPF2e, options: CastOptions): Promise<void>;
    }

    interface SpellcastingEntrySystemSource extends ItemSystemSource {
        traits: OtherTagsOnly;
        ability: { value: AttributeString | "" };
        spelldc: {
            value: number;
            dc: number;
        };
        tradition: { value: MagicTradition | "" };
        prepared: SpellCollectionTypeSource;
        showSlotlessLevels: {
            value: boolean;
        };
        proficiency: {
            slug: string;
            value: ZeroToFour;
        };
        slots: SpellcastingEntrySlots;
        autoHeightenLevel: {
            value: OneToTen | null;
        };
        level?: never;
    }

    interface SpellcastingEntrySystemSource extends ItemSystemSource {
        traits: OtherTagsOnly;
        ability: { value: AttributeString | "" };
        spelldc: {
            value: number;
            dc: number;
        };
        tradition: { value: MagicTradition | "" };
        prepared: SpellCollectionTypeSource;
        showSlotlessLevels: {
            value: boolean;
        };
        proficiency: {
            slug: string;
            value: ZeroToFour;
        };
        slots: SpellcastingEntrySlots;
        autoHeightenLevel: {
            value: OneToTen | null;
        };
        level?: never;
    }

    interface SpellcastingEntry<TActor extends ActorPF2e | null>
        extends BaseSpellcastingEntry<TActor> {
        attribute: AttributeString;
        statistic: Statistic;
        counteraction: Statistic;
    }

    type SpellcastingEntrySlots = Record<SlotKey, SpellSlotData>;

    interface SpellcastingEntrySystemData
        extends Omit<SpellcastingEntrySystemSource, "description">,
            Omit<ItemSystemData, "level" | "traits"> {
        prepared: SpellCollectionTypeData;
    }

    type SpellcastingEntrySource = BaseItemSourcePF2e<
        "spellcastingEntry",
        SpellcastingEntrySystemSource
    >;

    class SpellcastingEntryPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent>
        implements SpellcastingEntry<TParent>
    {
        statistic: Statistic<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>>;
        spells: SpellCollection<NonNullable<TParent>> | null;

        get tradition(): MagicTradition | null;
        get attribute(): AttributeString;
        get counteraction(): Statistic;
        get category(): SpellcastingCategory;
        get rank(): ZeroToFour;
        get isPrepared(): boolean;
        get isFlexible(): boolean;
        get isSpontaneous(): boolean;
        get isInnate(): boolean;
        get isFocusPool(): boolean;
        get isRitual(): false;
        get isEphemeral(): false;
        get highestRank(): ZeroToTen;
        get showSlotlessRanks(): boolean;

        setSlotExpendedState(
            groupId: SpellSlotGroupId,
            slotId: number,
            value: boolean
        ): Promise<Maybe<this>>;
        getSheetData(
            options?: GetSheetDataOptions<NonNullable<TParent>> | undefined
        ): Promise<SpellcastingSheetData>;
        canCast(spell: SpellPF2e, options?: { origin?: PhysicalItemPF2e }): boolean;
        cast(spell: SpellPF2e<ActorPF2e>, options?: CastOptions): Promise<void>;
    }

    interface SpellcastingEntryPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: SpellcastingEntrySource;
        system: SpellcastingEntrySystemData;
    }
}
