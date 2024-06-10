declare function getSummarizedSpellsDataForRender(actor: CreaturePF2e, sortByType: boolean, staffLabels: {
    staff: string;
    charges: string;
}, entries?: SpellcastingSheetData[]): Promise<{
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
declare function getHighestSpellcastingStatistic(actor: CharacterPF2e): {
    tradition: MagicTradition | null;
    statistic: Statistic<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>>;
} | undefined;
declare function getHighestSyntheticStatistic(actor: CharacterPF2e, withClassDcs?: boolean): Statistic<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>> | undefined;
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
export { getActorMaxRank, getHighestSpellcastingStatistic, getHighestSyntheticStatistic, getSummarizedSpellsDataForRender, };
export type { SummarizedSpellsData };
