export {};

declare global {
    type BackgroundSource = BaseItemSourcePF2e<"background", BackgroundSystemSource>;

    interface BackgroundSystemSource extends ABCSystemSource {
        traits: BackgroundTraits;
        boosts: Record<number, { value: AttributeString[]; selected: AttributeString | null }>;
        trainedSkills: {
            value: SkillSlug[];
            lore: string[];
        };
        level?: never;
    }

    type BackgroundTrait = "pervasive-magic";

    type BackgroundTraits = ItemTraits<BackgroundTrait>;

    interface BackgroundSystemData
        extends Omit<BackgroundSystemSource, "description" | "items">,
            Omit<ABCSystemData, "level" | "traits"> {}

    class BackgroundPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ABCItemPF2e<TParent> {}

    interface BackgroundPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ABCItemPF2e<TParent> {
        readonly _source: BackgroundSource;
        system: BackgroundSystemData;
    }
}
