export {};

declare global {
    type EquipmentSource = BasePhysicalItemSource<"equipment", EquipmentSystemSource>;

    interface EquipmentSystemSource extends Investable<PhysicalSystemSource> {
        traits: EquipmentTraits;
        usage: { value: string };
        /** Doubly-embedded adjustments, attachments, talismans etc. */
        subitems: PhysicalItemSource[];
    }

    interface EquipmentTraits extends PhysicalItemTraits<EquipmentTrait> {}

    interface EquipmentSystemData
        extends Omit<
                EquipmentSystemSource,
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
            Omit<Investable<PhysicalSystemData>, "subitems" | "traits"> {
        stackGroup: null;
    }

    class EquipmentPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface EquipmentPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: EquipmentSource;
        system: EquipmentSystemData;

        get traits(): Set<EquipmentTrait>;
    }
}
