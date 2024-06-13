import { RollNotePF2e } from "../../pf2e";

export {};

declare global {
    interface CastOptions {
        slotId?: number;
        /** The rank at which to cast the spell */
        rank?: OneToTen;
        consume?: boolean;
        message?: boolean;
        rollMode?: RollMode;
    }

    interface SpellcastingSlotGroup {
        id: SpellSlotGroupId;
        label: string;
        /** The highest spell rank that can be present in this slot group */
        maxRank: OneToTen;

        /**
         * Number of uses and max slots or spells.
         * If this is null, allowed usages are infinite.
         * If value is undefined then it's not expendable, it's a count of total spells instead.
         */
        uses?: {
            value?: number;
            max: number;
        };

        /** The number corresponding with spellcasting entries' "slotN" object */
        number?: number;

        active: (ActiveSpell | null)[];
    }

    interface SpellPrepEntry {
        spell: SpellPF2e<ActorPF2e>;
        signature: boolean;
    }

    interface ActiveSpell {
        spell: SpellPF2e<ActorPF2e>;
        /** The rank at which a spell is cast (if prepared or automatically heighted) */
        castRank?: number;
        expended?: boolean;
        /** Is this spell marked as signature/collection */
        signature?: boolean;
        /** Is the spell not actually of this rank? */
        virtual?: boolean;
        uses?: ValueAndMax;
    }

    type SpellSlotGroupId = "cantrips" | OneToTen;

    interface SpellCollectionData {
        groups: SpellcastingSlotGroup[];
        flexibleAvailable?: { value: number; max: number } | null;
        prepList: Record<ZeroToTen, SpellPrepEntry[]> | null;
    }

    type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";
    interface WarnInvalidDropParams {
        spell: SpellPF2e;
        groupId?: Maybe<SpellSlotGroupId>;
    }

    interface StatisticChatData {
        slug: string;
        label: string;
        rank: number | null;
        check: {
            label: string;
            mod: number;
            breakdown: string;
            map1: number;
            map2: number;
        };
        dc: {
            value: number;
            breakdown: string;
        };
    }

    type UnusedProperties = "actor" | "spells" | "getSheetData" | "cast" | "canCast";
    type OptionalProperties =
        | "isFlexible"
        | "isFocusPool"
        | "isInnate"
        | "isPrepared"
        | "isRitual"
        | "isSpontaneous";

    interface SpellcastingSheetData
        extends Omit<
                BaseSpellcastingEntry<ActorPF2e>,
                "statistic" | OptionalProperties | UnusedProperties
            >,
            SpellCollectionData {
        statistic: StatisticChatData | null;
        hasCollection: boolean;
        isFlexible?: boolean;
        isFocusPool?: boolean;
        isInnate?: boolean;
        isPrepared?: boolean;
        isRitual?: boolean;
        isSpontaneous?: boolean;
        isStaff?: boolean;
        usesSpellProficiency: boolean;
        showSlotlessLevels?: boolean;
        uses?: ValueAndMax;
    }

    interface GetSheetDataOptions<TActor extends ActorPF2e> {
        spells?: Maybe<SpellCollection<TActor>>;
        prepList?: boolean;
    }

    type SlotKey = `slot${ZeroToTen}`;

    interface SpellAttackRollModifier {
        breakdown: string;
        notes: RollNotePF2e[];
        roll: Function;
        value: number;
    }

    interface SpellDifficultyClass {
        breakdown: string;
        notes: RollNotePF2e[];
        value: number;
    }

    interface SpellPrepData {
        id: string | null;
        expended: boolean;
    }

    interface SpellSlotData {
        prepared: SpellPrepData[];
        value: number;
        max: number;
    }

    type SpellcastingCategory =
        | "items"
        | "focus"
        | "prepared"
        | "spontaneous"
        | "innate"
        | "ritual"
        | "charges";

    interface SpellCollectionTypeSource {
        value: SpellcastingCategory;
        flexible?: boolean;
        validItems?: "scroll" | "" | null;
    }

    interface SpellCollectionTypeData extends SpellCollectionTypeSource {
        flexible: boolean;
        validItems: "scroll" | null;
    }

    class ActorSpellcasting<TActor extends ActorPF2e> extends DelegatedCollection<
        BaseSpellcastingEntry<TActor>
    > {
        collections: Collection<SpellCollection<TActor>>;

        get regular(): SpellcastingEntryPF2e<TActor>[];
        get spellcastingFeatures(): SpellcastingEntryPF2e<TActor>[];
    }

    class SpellCollection<TActor extends ActorPF2e> extends Collection<SpellPF2e<TActor>> {
        readonly entry: BaseSpellcastingEntry<TActor>;
        readonly actor: TActor;
        readonly name: string;

        constructor(entry: BaseSpellcastingEntry<TActor>, name?: string);

        get id(): string;
        get highestRank(): OneToTen;

        setSlotExpendedState(
            groupId: SpellSlotGroupId,
            slotIndex: number,
            value: boolean
        ): Promise<this | null>;
        getSpellData(options?: { prepList?: boolean }): Promise<SpellCollectionData>;
    }
}
