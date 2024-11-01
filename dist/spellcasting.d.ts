type CustomSpellcastingSheetData = SpellcastingSheetData & {
    isAnimistEntry?: boolean;
};
declare function getSummarizedSpellsDataForRender(actor: CreaturePF2e, sortByType: boolean, staffLabels: {
    staff: string;
    charges: string;
}, entries?: CustomSpellcastingSheetData[]): Promise<{
    labels: string[];
    spells: SummarizedSpell[][];
    focusPool: {
        value: number;
        max: number;
        cap: number;
    } | {
        value: number;
        max: number;
    };
    isOwner: boolean;
    hasFocusCantrip: boolean;
}>;
declare function getActorMaxRank(actor: CreaturePF2e): OneToTen;
declare function getSpellcastingMaxRank(entry: SpellcastingEntryPF2e, rankLimit?: OneToTen): ZeroToTen;
declare function getHighestSpellcastingStatistic(actor: NPCPF2e | CharacterPF2e): {
    tradition: MagicTradition | null;
    statistic: Statistic<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>>;
} | undefined;
declare function getHighestSyntheticStatistic(actor: NPCPF2e | CharacterPF2e, withClassDcs?: boolean): Statistic<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>> | undefined;
declare function createSpellcastingWithHighestStatisticSource(actor: NPCPF2e | CharacterPF2e, { name, category, flags, showSlotlessRanks, sort, withClassDcs, }: CreateSpellcastingSourceWithHighestStatistic): (Omit<DeepPartial<SpellcastingEntrySource>, "type" | "name" | "_id"> & {
    _id?: Maybe<string>;
    name: string;
    type: "spellcastingEntry";
}) | undefined;
declare function createSpellcastingSource({ name, category, attribute, flags, proficiencyRank, proficiencySlug, showSlotlessRanks, sort, tradition, }: CreateSpellcastingSource): PreCreate<SpellcastingEntrySource>;
type CreateSpellcastingSource = {
    name: string;
    category?: SpellcastingCategory;
    sort?: number;
    attribute?: AttributeString | null;
    proficiencySlug?: string;
    showSlotlessRanks?: boolean;
    proficiencyRank?: ZeroToFour | null;
    tradition?: MagicTradition;
    flags?: Record<string, any>;
};
type CreateSpellcastingSourceWithHighestStatistic = Omit<CreateSpellcastingSource, "attribute" | "proficiencyRank" | "proficiencySlug" | "tradition"> & {
    withClassDcs?: boolean;
};
type SummarizedSpell = {
    itemId: string;
    entryId: string;
    entryDc: number | undefined;
    entryTooltip: string;
    groupId: SpellSlotGroupId;
    castRank: number;
    slotId: number | undefined;
    parentId: string | undefined;
    expended: boolean | undefined;
    name: string;
    action: string;
    img: string;
    order: number;
    entryName: string;
    category: string;
    isBroken: boolean;
    isFocus: boolean | undefined;
    isRitual: boolean | undefined;
    isCharges: boolean;
    isStaff: boolean | undefined;
    isInnate: boolean | undefined;
    isPrepared: boolean | undefined;
    isSpontaneous: boolean | undefined;
    isFlexible: boolean | undefined;
    isVirtual: boolean | undefined;
    isAnimistEntry: boolean | undefined;
    annotation: AuxiliaryActionPurpose;
    consumable: ConsumablePF2e | undefined;
    range: string;
    rank: ZeroToTen;
    uses: (ValueAndMax & {
        input: string;
        itemId: string;
    }) | undefined;
};
type SummarizedSpellsData = {
    labels: string[];
    spells: SummarizedSpell[][];
    focusPool: {
        value: number;
        max: number;
        cap?: number;
    };
    isOwner: boolean;
    hasFocusCantrip: boolean;
};
export { createSpellcastingSource, createSpellcastingWithHighestStatisticSource, getActorMaxRank, getHighestSpellcastingStatistic, getHighestSyntheticStatistic, getSpellcastingMaxRank, getSummarizedSpellsDataForRender, };
export type { CreateSpellcastingSource, CreateSpellcastingSourceWithHighestStatistic, SummarizedSpellsData, };
