export {};

declare global {
    type ShieldSource = BasePhysicalItemSource<"shield", ShieldSystemSource>;

    interface ShieldSystemSource extends PhysicalSystemSource {
        traits: ShieldTraitsSource;
        baseItem: BaseShieldType | null;
        acBonus: number;
        speedPenalty: number;
        /** Data stored at the time of marking a shield as specific */
        specific: SpecificShieldData | null;
        /** Currently supports reinforcing runes */
        runes: ShieldRuneData;
        /** Usage for shields isn't stored. */
        readonly usage?: never;
        /** Doubly-embedded adjustments, attachments, talismans etc. */
        subitems: PhysicalItemSource[];
    }

    interface IntegratedWeaponSource {
        runes: WeaponRuneSource;
        versatile: { selected: DamageType } | null;
    }

    type BaseShieldType = string;
    type ShieldTrait = string;

    interface ShieldTraitsSource extends PhysicalItemTraits<ShieldTrait> {
        integrated: IntegratedWeaponSource | null;
    }

    type ShieldRuneData = { reinforcing: ZeroToSix };

    /** A weapon can either be unspecific or specific along with baseline material and runes */
    interface SpecificShieldData extends Pick<ShieldSystemSource, "material" | "runes"> {
        integrated: { runes: Omit<WeaponRuneData, "effects"> } | null;
    }

    interface ShieldTraits extends ShieldTraitsSource {
        integrated: IntegratedWeaponData | null;
    }

    interface IntegratedWeaponData extends IntegratedWeaponSource {
        damageType: DamageType;
        versatile: { options: DamageType[]; selected: DamageType } | null;
    }

    interface ShieldSystemData
        extends Omit<
                ShieldSystemSource,
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
            Omit<PhysicalSystemData, "baseItem" | "subitems" | "traits"> {
        traits: ShieldTraits;
        /** Shields are always held. */
        usage: HeldUsage;
        stackGroup: null;
    }

    class ShieldPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface ShieldPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: ShieldSource;
        system: ShieldSystemData;

        get traits(): Set<ShieldTrait>;
    }
}
