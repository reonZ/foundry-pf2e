export {};

declare global {
    /** The stored source data of a loot actor */
    type LootSource = BaseActorSourcePF2e<"loot", LootSystemSource>;

    /** The system-level data of loot actors. */
    interface LootSystemSource extends ActorSystemSource {
        attributes: LootAttributesSource;
        details: LootDetailsSource;
        lootSheetType: "Merchant" | "Loot";
        hiddenWhenEmpty: boolean;
        traits?: never;
    }

    interface LootSystemData
        extends Omit<LootSystemSource, "attributes" | "details">,
            ActorSystemData {
        attributes: LootAttributes;
        details: LootDetails;
        traits?: never;
    }

    interface LootAttributesSource extends ActorAttributesSource {
        hp?: never;
        ac?: never;
        perception?: never;
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    interface LootAttributes
        extends Omit<LootAttributesSource, "immunities" | "weaknesses" | "resistances">,
            Omit<ActorAttributes, "perception" | "hp" | "ac"> {
        initiative?: never;
    }

    interface LootDetailsSource {
        alliance?: never;
        description: string;
        level: {
            value: number;
        };
    }

    interface LootDetails extends Omit<LootDetailsSource, "alliance">, ActorDetails {
        alliance: null;
    }

    class LootPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends ActorPF2e<TParent> {}

    interface LootPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends ActorPF2e<TParent> {
        readonly _source: LootSource;
        system: LootSystemData;

        readonly saves?: never;

        get hitPoints(): null;
    }
}
