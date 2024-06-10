export {};

declare global {
    type ContainerSource = BasePhysicalItemSource<"backpack", ContainerSystemSource>;

    type ContainerTraits = PhysicalItemTraits<EquipmentTrait>;

    interface ContainerSystemSource extends Investable<PhysicalSystemSource> {
        traits: ContainerTraits;
        stowing: boolean;
        bulk: ContainerBulkSource;
        collapsed: boolean;
        usage: { value: string };
        subitems?: never;
    }

    interface ContainerBulkSource {
        value: number;
        heldOrStowed: number;
        capacity: number;
        ignored: number;
    }

    interface ContainerSystemData
        extends Omit<
                ContainerSystemSource,
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
        bulk: ContainerBulkData;
        stackGroup: null;
    }

    type EquipmentTrait = string;

    interface ContainerBulkData extends ContainerBulkSource, BulkData {}

    class ContainerPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface ContainerPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: ContainerSource;
        system: ContainerSystemData;

        get traits(): Set<EquipmentTrait>;
    }
}
