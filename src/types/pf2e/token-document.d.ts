export {};

declare global {
    type TokenFlagsPF2e = DocumentFlags & {
        pf2e: {
            [key: string]: unknown;
            linkToActorSize: boolean;
            autoscale: boolean;
        };
        [key: string]: Record<string, unknown>;
    };

    class TokenConfigPF2e<TDocument extends TokenDocumentPF2e> extends TokenConfig<TDocument> {}

    class TokenDocumentPF2e<
        TParent extends ScenePF2e | null = ScenePF2e | null
    > extends TokenDocument<TParent> {
        declare auras: Map<string, TokenAura>;

        get center(): Point;
        get scene(): this["parent"];
        get actor(): ActorPF2e<this | null> | null;
        get baseActor(): ActorPF2e<null>;
        get object(): TokenPF2e<this> | null;
        get sheet(): TokenConfigPF2e<this>;
        get playersCanSeeName(): boolean;
        get combatant(): CombatantPF2e<EncounterPF2e, this> | null;

        simulateUpdate(actorUpdates?: Record<string, unknown>): void;
    }

    interface TokenDocumentPF2e<TParent extends ScenePF2e | null = ScenePF2e | null>
        extends TokenDocument<TParent> {
        flags: TokenFlagsPF2e;
    }

    class ActorDeltaPF2e<TParent extends TokenDocumentPF2e | null> extends ActorDelta<TParent> {}

    interface ActorDeltaPF2e<TParent extends TokenDocumentPF2e | null> extends ActorDelta<TParent> {
        readonly _source: ActorDeltaSourcePF2e;
    }

    type ActorDeltaSourcePF2e = ActorDeltaSource & {
        system: ActorSystemSource | null;
    };

    type ActorDeltaSchema = {
        _id: foundry.data.fields.DocumentIdField;
        name: foundry.data.fields.StringField<string, string, false, true, true>;
        type: foundry.data.fields.StringField<string, string, false, true, true>;
        img: foundry.data.fields.FilePathField<ImageFilePath, ImageFilePath, false, true, true>;
        system: foundry.data.fields.ObjectField<object, object, true, true, true>;
        items: foundry.data.fields.EmbeddedCollectionDeltaField<
            foundry.documents.BaseItem<foundry.documents.BaseActor>,
            (
                | DocumentSourceFromSchema<foundry.documents.ItemSchema, true>
                | SourceFromSchema<foundry.data.TombstoneDataSchema>
            )[]
        >;
        effects: foundry.data.fields.EmbeddedCollectionDeltaField<
            foundry.documents.BaseActiveEffect<foundry.documents.BaseActor>
        >;
        ownership: foundry.data.fields.DocumentOwnershipField;
        flags: foundry.data.fields.ObjectField<DocumentFlags>;
    };

    type ActorDeltaSource = SourceFromSchema<ActorDeltaSchema>;
}
