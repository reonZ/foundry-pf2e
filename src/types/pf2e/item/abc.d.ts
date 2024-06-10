export {};

declare global {
    type CreatureTraits = TraitsWithRarity<CreatureTrait>;
    type AncestryTraits = ItemTraits<CreatureTrait>;

    interface ABCFeatureEntryData {
        uuid: string;
        img: ImageFilePath;
        name: string;
        level: number;
    }

    interface ABCSystemSource extends ItemSystemSource {
        items: Record<string, ABCFeatureEntryData>;
    }

    interface ABCSystemData extends Omit<ABCSystemSource, "description">, ItemSystemData {}

    interface AncestrySystemSource extends ABCSystemSource {
        traits: AncestryTraits;
        additionalLanguages: {
            count: number; // plus int
            value: string[];
            custom: string;
        };
        /** If present, use the alternate ancestry boosts, which are two free */
        alternateAncestryBoosts?: AttributeString[];
        boosts: Record<string, { value: AttributeString[]; selected: AttributeString | null }>;
        flaws: Record<string, { value: AttributeString[]; selected: AttributeString | null }>;
        voluntary?: {
            boost?: AttributeString | null;
            flaws: AttributeString[];
        };
        hp: number;
        languages: ValuesList<Language>;
        speed: number;
        size: Size;
        reach: number;
        vision: "normal" | "darkvision" | "low-light-vision";
        level?: never;
    }

    abstract class ABCItemPF2e<TParent extends ActorPF2e | null> extends ItemPF2e<TParent> {}

    interface ABCItemPF2e<TParent extends ActorPF2e | null> extends ItemPF2e<TParent> {
        readonly _source: AncestrySource | BackgroundSource | ClassSource;
        system: AncestrySystemData | BackgroundSystemData | ClassSystemData;
    }
}
