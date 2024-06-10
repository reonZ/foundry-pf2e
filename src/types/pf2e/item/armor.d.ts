export {};

declare global {
    type ArmorSource = BasePhysicalItemSource<"armor", ArmorSystemSource>;

    interface ArmorSystemSource extends Investable<PhysicalSystemSource> {
        traits: ArmorTraits;
        category: ArmorCategory;
        group: ArmorGroup | null;
        baseItem: BaseArmorType | null;
        acBonus: number;
        strength: number | null;
        dexCap: number;
        checkPenalty: number;
        speedPenalty: number;
        runes: ArmorRuneSource;
        /** Details of specific magic armor, storing the material and rune state when toggled on */
        specific: SpecificArmorData | null;
        /** Doubly-embedded adjustments, attachments, talismans etc. */
        subitems: PhysicalItemSource[];
        /** Usage for armor isn't stored. */
        readonly usage?: never;
    }

    type ArmorRuneSource = {
        potency: ZeroToFour;
        resilient: ZeroToThree;
        property: ArmorPropertyRuneType[];
    };

    /** A weapon can either be unspecific or specific along with baseline material and runes */
    type SpecificArmorData = {
        material: ItemMaterialSource;
        runes: ArmorRuneSource;
    };

    interface ArmorSystemData
        extends Omit<
                ArmorSystemSource,
                | "apex"
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<Investable<PhysicalSystemData>, "baseItem" | "subitems" | "traits"> {
        runes: ArmorRuneData;
        /** Armor is always worn in the "armor" slot. */
        usage: WornUsage;
        stackGroup: null;
    }

    interface ArmorTraits extends PhysicalItemTraits<ArmorTrait> {
        otherTags: OtherArmorTag[];
    }

    interface ArmorRuneData extends ArmorRuneSource {
        effects: ArmorPropertyRuneType[];
    }

    type ArmorCategory =
        | "light"
        | "unarmored"
        | "medium"
        | "heavy"
        | "light-barding"
        | "heavy-barding";
    type ArmorGroup = "wood" | "composite" | "chain" | "cloth" | "leather" | "plate" | "skeletal";
    type ArmorPropertyRuneType = string;
    type ArmorTrait = string;
    type BaseArmorType = string;
    type OtherArmorTag = "shoddy";
    type ResilientRuneType = "" | "resilient" | "greaterResilient" | "majorResilient";

    class ArmorPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface ArmorPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: ArmorSource;
        system: ArmorSystemData;
    }
}
