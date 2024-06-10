export {};

declare global {
    type FamiliarSource = BaseCreatureSource<"familiar", FamiliarSystemSource>;

    interface FamiliarSystemSource extends CreatureSystemSource {
        details: FamiliarDetailsSource;
        attributes: FamiliarAttributesSource;
        master: {
            id: string | null;
            ability: AttributeString | null;
        };

        customModifiers?: never;
        perception?: never;
        resources?: never;
        saves?: never;
        skills?: never;
        traits?: never;
    }

    interface FamiliarAttributesSource {
        hp: { value: number; temp: number };
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    interface FamiliarDetailsSource extends CreatureDetailsSource {
        creature: {
            value: string;
        };
        alliance?: never;
        languages?: never;
        level?: never;
    }

    /** The raw information contained within the actor data object for familiar actors. */
    interface FamiliarSystemData
        extends Omit<
                FamiliarSystemSource,
                | "attributes"
                | "customModifiers"
                | "details"
                | "perception"
                | "toggles"
                | "resources"
                | "saves"
                | "skills"
                | "traits"
            >,
            CreatureSystemData {
        details: FamiliarDetails;
        attack: StatisticTraceData;
        attributes: CreatureAttributes;
        master: {
            id: string | null;
            ability: AttributeString | null;
        };

        actions?: never;
        initiative?: never;
    }

    interface FamiliarDetails extends CreatureDetails {
        creature: {
            value: string;
        };
    }

    class FamiliarPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends CreaturePF2e<TParent> {}

    interface FamiliarPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends CreaturePF2e<TParent> {
        readonly _source: FamiliarSource;
        system: FamiliarSystemData;
    }
}
