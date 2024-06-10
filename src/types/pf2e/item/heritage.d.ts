export {};

declare global {
    type HeritageSource = BaseItemSourcePF2e<"heritage", HeritageSystemSource>;

    interface HeritageSystemSource extends ItemSystemSource {
        ancestry: {
            name: string;
            slug: string;
            uuid: ItemUUID;
        } | null;
        traits: AncestryTraits;
        level?: never;
    }

    interface HeritageSystemData
        extends Omit<HeritageSystemSource, "description">,
            Omit<ItemSystemData, "level" | "traits"> {}

    class HeritagePF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {}

    interface HeritagePF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: HeritageSource;
        system: HeritageSystemData;
    }
}
