export {};

declare global {
    type BookSource = BasePhysicalItemSource<"book", BookSystemSource>;
    type BookTraits = PhysicalItemTraits<EquipmentTrait>;

    interface BookSystemSource extends PhysicalSystemSource {
        traits: BookTraits;
        category: "formula" | "spell";
        capacity: number;
        contents: ItemUUID[];
        subitems?: never;
    }

    interface BookSystemData
        extends Omit<
                BookSystemSource,
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
            Omit<PhysicalSystemData, "subitems" | "traits"> {}

    class BookPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface BookPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: BookSource;
        system: BookSystemData;
    }
}
