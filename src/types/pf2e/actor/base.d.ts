export {};

declare global {
    type ActorType =
        | "army"
        | "character"
        | "familiar"
        | "hazard"
        | "loot"
        | "npc"
        | "party"
        | "vehicle";

    type ActorSourcePF2e =
        | ArmySource
        | CreatureSource
        | HazardSource
        | LootSource
        | PartySource
        | VehicleSource;

    interface ActorInstances<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null> {
        army: ArmyPF2e<TParent>;
        character: CharacterPF2e<TParent>;
        creature: CreaturePF2e<TParent>;
        familiar: FamiliarPF2e<TParent>;
        hazard: HazardPF2e<TParent>;
        loot: LootPF2e<TParent>;
        party: PartyPF2e<TParent>;
        npc: NPCPF2e<TParent>;
        vehicle: VehiclePF2e<TParent>;
    }

    interface HitPointsSummary {
        value: number;
        max: number;
        temp: number;
        unrecoverable: number;
        negativeHealing: boolean;
    }

    interface ActorUpdateOperation<TParent extends TokenDocumentPF2e | null>
        extends DatabaseUpdateOperation<TParent> {
        damageTaken?: number;
        finePowder?: boolean;
        damageUndo?: boolean;
    }

    interface EmbeddedItemUpdateOperation<TParent extends ActorPF2e>
        extends DatabaseUpdateOperation<TParent> {
        checkHP?: boolean;
    }

    type EmbeddedItemInstances<TParent extends ActorPF2e> = {
        [K in keyof ItemInstances<TParent>]: ItemInstances<TParent>[K][];
    };

    interface AuraData {
        slug: string;
        level: number | null;
        radius: number;
        traits: EffectTrait[];
        effects: AuraEffectData[];
        appearance: AuraAppearanceData;
    }

    interface AuraAppearanceData {
        border: { color: number; alpha: number } | null;
        highlight: { color: number; alpha: number };
        texture: {
            src: ImageFilePath | VideoFilePath;
            alpha: number;
            scale: number;
            translation: { x: number; y: number } | null;
            loop: boolean;
            playbackRate: number;
        } | null;
    }

    interface AuraEffectData {
        uuid: string;
        affects: "allies" | "enemies" | "all";
        events: ("enter" | "turn-start" | "turn-end")[];
        save: {
            type: SaveType;
            dc: number;
        } | null;
        predicate: Predicate;
        removeOnExit: boolean;
        includesSelf: boolean;
        alterations: ItemAlteration[];
    }

    class ActorPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends Actor<TParent> {
        /** Has this document completed `DataModel` initialization? */
        declare initialized: boolean;
        /** A UUIDv5 hash digest of the foundry UUID */
        declare signature: string;
        /** Handles rolling initiative for the current actor */
        declare initiative: ActorInitiative | null;
        /** A separate collection of owned physical items for convenient access */
        declare inventory: ActorInventory<this>;
        declare armorClass: StatisticDifficultyClass<ArmorStatistic> | null;
        /** A separate collection of owned spellcasting entries for convenience */
        declare spellcasting: ActorSpellcasting<this> | null;
        /** Rule elements drawn from owned items */
        declare rules: RuleElementPF2e[];
        declare synthetics: RuleElementSynthetics;
        /** Saving throw statistics */
        declare saves?: { [K in SaveType]?: Statistic };
        /** Data from rule elements for auras this actor may be emanating */
        declare auras: Map<string, AuraData>;
        /** A collection of this actor's conditions */
        declare conditions: ActorConditions<this>;
        declare perception?: PerceptionStatistic;
        /** Skill checks for the actor if supported by the actor type */
        declare skills?: Record<string, Statistic<this>>;
        /** A cached copy of `Actor#itemTypes`, lazily regenerated every data preparation cycle */
        private declare _itemTypes: EmbeddedItemInstances<this> | null;

        get level(): number;
        get isDead(): boolean;
        get alliance(): ActorAlliance;
        get itemTypes(): EmbeddedItemInstances<this>;
        get attributes(): this["system"]["attributes"];
        get heldShield(): ShieldPF2e<this> | null;

        getReach(_options: GetReachParameters): number;

        isOfType<T extends "creature" | ActorType>(
            ...types: T[]
        ): this is ActorInstances<TParent>[T];
        isOfType(...types: string[]): boolean;

        /** Get (almost) any statistic by slug: handling expands in `ActorPF2e` subclasses */
        getStatistic(slug: string): Statistic<this> | null;
        getStatistic(slug: string): Statistic | null;

        addToInventory(
            itemSource: PhysicalItemSource,
            container?: ContainerPF2e<this>,
            newStack?: boolean
        ): Promise<PhysicalItemPF2e<this> | null>;
    }

    interface ActorPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends Actor<TParent> {
        flags: ActorFlagsPF2e;
        readonly _source: ActorSourcePF2e;
        readonly effects: foundry.abstract.EmbeddedCollection<ActiveEffectPF2e<this>>;
        readonly items: foundry.abstract.EmbeddedCollection<ItemPF2e<this>>;
        system: ActorSystemData;

        prototypeToken: PrototypeTokenPF2e<this>;

        get sheet(): ActorSheetPF2e<ActorPF2e>;

        update(
            data: Record<string, unknown>,
            operation?: Partial<ActorUpdateOperation<TParent>>
        ): Promise<this | undefined>;

        getActiveTokens(
            linked: boolean | undefined,
            document: true
        ): TokenDocumentPF2e<ScenePF2e>[];
        getActiveTokens(
            linked?: boolean | undefined,
            document?: false
        ): TokenPF2e<TokenDocumentPF2e<ScenePF2e>>[];
        getActiveTokens(
            linked?: boolean,
            document?: boolean
        ): TokenDocumentPF2e<ScenePF2e>[] | TokenPF2e<TokenDocumentPF2e<ScenePF2e>>[];

        /** See implementation in class */
        createEmbeddedDocuments(
            embeddedName: "ActiveEffect",
            data: PreCreate<foundry.documents.ActiveEffectSource>[],
            operation?: Partial<DatabaseCreateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[]>;
        createEmbeddedDocuments(
            embeddedName: "Item",
            data: PreCreate<ItemSourcePF2e>[],
            operation?: Partial<DatabaseCreateOperation<this>>
        ): Promise<ItemPF2e<this>[]>;
        createEmbeddedDocuments(
            embeddedName: "ActiveEffect" | "Item",
            data: PreCreate<foundry.documents.ActiveEffectSource>[] | PreCreate<ItemSourcePF2e>[],
            operation?: Partial<DatabaseCreateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[] | ItemPF2e<this>[]>;

        /** See implementation in class */
        updateEmbeddedDocuments(
            embeddedName: "ActiveEffect",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<DatabaseUpdateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[]>;
        updateEmbeddedDocuments(
            embeddedName: "Item",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<EmbeddedItemUpdateOperation<this>>
        ): Promise<ItemPF2e<this>[]>;
        updateEmbeddedDocuments(
            embeddedName: "ActiveEffect" | "Item",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<DatabaseUpdateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[] | ItemPF2e<this>[]>;

        /** Added as debounced method */
        checkAreaEffects(): void;

        increaseCondition(
            conditionSlug: ConditionSlug | ConditionPF2e<this>,
            options?: { max?: number; value?: number | null }
        ): Promise<ConditionPF2e<this> | null>;

        decreaseCondition(
            conditionSlug: ConditionKey | ConditionPF2e<this>,
            options?: { forceRemove: boolean }
        ): Promise<void>;

        toggleRollOption(domain: string, option: string, value?: boolean): Promise<boolean | null>;
        toggleRollOption(
            domain: string,
            option: string,
            itemId?: string | null,
            value?: boolean,
            suboption?: string | null
        ): Promise<boolean | null>;
        toggleRollOption(
            domain: string,
            option: string,
            itemId?: string | boolean | null,
            value?: boolean,
            suboption?: string | null
        ): Promise<boolean | null>;
    }
}
