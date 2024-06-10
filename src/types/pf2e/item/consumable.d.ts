export {};

declare global {
    type ConsumableSource = BasePhysicalItemSource<"consumable", ConsumableSystemSource>;

    type SpellConsumableItemType = "scroll" | "wand" | "cantripDeck5";

    type AmmoStackGroup =
        | "arrows"
        | "blowgunDarts"
        | "bolts"
        | "rounds5"
        | "rounds10"
        | "slingBullets"
        | "sprayPellets"
        | "woodenTaws";

    type ConsumableCategory =
        | "poison"
        | "catalyst"
        | "elixir"
        | "fulu"
        | "gadget"
        | "mutagen"
        | "oil"
        | "potion"
        | "scroll"
        | "snare"
        | "talisman"
        | "wand"
        | "drug"
        | "ammo"
        | "other"
        | "toolkit";

    type ConsumableTrait = string;

    type OtherConsumableTag = "herbal";

    interface ConsumableTraits extends PhysicalItemTraits<ConsumableTrait> {
        otherTags: OtherConsumableTag[];
    }

    interface ConsumableSystemSource extends PhysicalSystemSource {
        apex?: never;
        traits: ConsumableTraits;
        category: ConsumableCategory;
        uses: ConsumableUses;
        /** A formula for a healing or damage roll */
        damage: ConsumableDamageHealing | null;
        spell: SpellSource | null;
        usage: { value: string };
        stackGroup: AmmoStackGroup | null;
        subitems?: never;
    }

    type ConsumableUses = {
        value: number;
        max: number;
        /** Whether to delete the consumable upon use if it has no remaining uses and a quantity of 1 */
        autoDestroy: boolean;
    };

    type ConsumableDamageHealing = {
        formula: string;
        type: DamageType;
        kind: DamageKind;
    };

    interface ConsumableSystemData
        extends Omit<
                ConsumableSystemSource,
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<PhysicalSystemData, "subitems" | "traits"> {
        apex?: never;
        stackGroup: AmmoStackGroup | null;
    }

    class ConsumablePF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {
        get category(): ConsumableCategory;
        get otherTags(): Set<OtherConsumableTag>;
        get isAmmo(): boolean;
        get uses(): ValueAndMax;
        get embeddedSpell(): SpellPF2e<NonNullable<TParent>> | null;

        consume(thisMany?: number): Promise<void>;
    }

    interface ConsumablePF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: ConsumableSource;
        system: ConsumableSystemData;
    }
}
