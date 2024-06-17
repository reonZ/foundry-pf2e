export {};

declare global {
    type BaseItemSourcePF2e<
        TType extends ItemType,
        TSystemSource extends ItemSystemSource = ItemSystemSource
    > = foundry.documents.ItemSource<TType, TSystemSource> & {
        flags: ItemSourceFlagsPF2e;
    };

    type RangeData = {
        increment: number | null;
        max: number;
    };

    type ProficiencyRank = "master" | "untrained" | "trained" | "expert" | "legendary";

    interface ItemSourceFlagsPF2e extends DeepPartial<foundry.documents.ItemFlags> {
        pf2e?: {
            rulesSelections?: Record<string, string | number | object>;
            itemGrants?: Record<string, ItemGrantSource>;
            grantedBy?: ItemGrantSource | null;
            [key: string]: unknown;
        };
    }

    type ItemSystemSource = {
        level?: { value: number };
        description: ItemDescriptionSource;
        traits: ItemTraits | ItemTraitsNoRarity | RarityTraitAndOtherTags | OtherTagsOnly;
        rules: RuleElementSource[];
        /** A non-unique but human-readable identifier for this item */
        slug: string | null;

        /** Information concerning the publication from which this item originates */
        publication: PublicationData;

        /** Legacy location of `MigrationRecord` */
        schema?: object;
    };

    type ItemTrait = string;

    interface ItemTraits<T extends ItemTrait = ItemTrait> {
        value: T[];
        rarity: Rarity;
        otherTags: string[];
    }

    interface ItemTraitsNoRarity<T extends ItemTrait = ItemTrait>
        extends Omit<ItemTraits<T>, "rarity"> {
        rarity?: never;
    }

    interface RarityTraitAndOtherTags {
        readonly value?: never;
        rarity: Rarity;
        otherTags: string[];
    }

    interface OtherTagsOnly {
        readonly value?: never;
        rarity?: never;
        otherTags: string[];
    }

    interface ItemFlagsPF2e extends foundry.documents.ItemFlags {
        pf2e: {
            rulesSelections: Record<string, string | number | object | null>;
            itemGrants: Record<string, ItemGrantData>;
            grantedBy: ItemGrantData | null;
            [key: string]: unknown;
        };
    }

    type ItemGrantDeleteAction = "cascade" | "detach" | "restrict";

    interface ItemGrantSource {
        /** The ID of a granting or granted item */
        id: string;
        /** The action taken when the user attempts to delete the item referenced by `id` */
        onDelete?: ItemGrantDeleteAction;
    }

    type ItemGrantData = Required<ItemGrantSource>;

    interface ItemDescriptionSource {
        gm: string;
        value: string;
    }

    interface ItemSystemData extends Omit<ItemSystemSource, "schema"> {
        description: ItemDescriptionData;
    }

    interface ItemDescriptionData extends ItemDescriptionSource {
        /** Additional text added by rule elements */
        addenda: {
            label: string;
            contents: AlteredDescriptionContent[];
        }[];
        override: AlteredDescriptionContent[] | null;
    }

    interface AlteredDescriptionContent {
        title: string | null;
        text: string;
        divider: boolean;
        predicate: Predicate;
    }

    type FrequencyInterval =
        | "day"
        | "round"
        | "turn"
        | "PT1M"
        | "PT10M"
        | "PT1H"
        | "PT24H"
        | "P1W"
        | "P1M"
        | "P1Y";

    interface FrequencySource {
        value?: number;
        max: number;
        /** Gap between recharges as an ISO8601 duration, or "day" for daily prep. */
        per: FrequencyInterval;
    }

    type ItemSchemaPF2e = Omit<foundry.documents.ItemSchema, "system"> & {
        system: foundry.data.fields.TypeDataField;
    };

    interface Frequency extends FrequencySource {
        value: number;
    }

    interface ItemSystemData extends Omit<ItemSystemSource, "schema"> {
        description: ItemDescriptionData;
    }
}
