export {};

declare global {
    type AncestrySource = BaseItemSourcePF2e<"ancestry", AncestrySystemSource>;

    interface AncestrySystemData
        extends Omit<AncestrySystemSource, "description" | "items">,
            Omit<ABCSystemData, "level" | "traits"> {}

    class AncestryPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ABCItemPF2e<TParent> {
        get traits(): Set<CreatureTrait>;
        get hitPoints(): number;
        get speed(): number;
        get size(): Size;
        get lockedBoosts(): AttributeString[];
        get lockedFlaws(): AttributeString[];
    }

    interface AncestryPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ABCItemPF2e<TParent> {
        readonly _source: AncestrySource;
        system: AncestrySystemData;
    }
}
