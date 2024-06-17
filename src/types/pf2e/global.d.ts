export {};

interface GamePF2e
    extends Game<
        ActorPF2e<null>,
        ActorsPF2e<ActorPF2e<null>>,
        ChatMessagePF2e,
        EncounterPF2e,
        ItemPF2e<null>,
        MacroPF2e,
        ScenePF2e,
        UserPF2e
    > {
    pf2e: {
        Check: typeof CheckPF2e;
        Coins: typeof CoinsPF2e;
        Predicate: typeof Predicate;
        Modifier: ConstructorOf<ModifierPF2e>;
        ElementalBlast: typeof ElementalBlast;
        StatisticModifier: typeof StatisticModifier;
        effectPanel: EffectsPanel;
        compendiumBrowser: CompendiumBrowser;
        actions: Record<string, Function> & Collection<Action>;
        settings: {
            automation: {
                /** Flanking detection */
                flanking: boolean;
            };
            /** Campaign feat slots */
            campaign: {
                feats: {
                    enabled: boolean;
                    sections: FeatGroupOptions[];
                };
                languages: LanguageSettings;
            };
            critFumble: {
                buttons: boolean;
                cards: boolean;
            };
            /** Encumbrance automation */
            encumbrance: boolean;
            gmVision: boolean;
            /** Immunities, weaknesses, and resistances */
            iwr: boolean;
            metagame: {
                breakdowns: boolean;
                dcs: boolean;
                secretChecks: boolean;
                partyStats: boolean;
                partyVision: boolean;
                results: boolean;
            };
            /** Rules-based vision */
            rbv: boolean;
            tokens: {
                /** Automatic scaling of tokens belong to small actor */
                autoscale: boolean;
                /** Token nameplate visibility sets name visibility in encounter tracker */
                nameVisibility: boolean;
                /** Nath Mode */
                nathMode: boolean;
            };
            /** Theater-of-the-mind toggles */
            totm: boolean;
            /** Variant urles */
            variants: {
                /** Automatic Bonus Progression */
                abp: "noABP" | "ABPFundamentalPotency" | "ABPRulesAsWritten";
                /** Free Archetype */
                fa: boolean;
                /** Gradual Ability Boosts */
                gab: boolean;
                /** Proficiency without Level */
                pwol: {
                    enabled: boolean;
                    /** Modifiers for each proficiency rank */
                    modifiers: [number, number, number, number, number];
                };
                /** Stamina */
                stamina: boolean;
            };
        };
        system: {
            // moduleArt: ModuleArt;
            // remigrate: typeof remigrate;
            sluggify: (text: string, options?: { camel?: SlugCamel }) => string;
            generateItemName: (item: PhysicalItemPF2e) => string;
        };
    };

    dice3d?: {
        showForRoll(
            roll: Roll | Rolled<Roll>,
            user?: User,
            synchronize?: boolean,
            users?: (User | string)[],
            blind?: boolean,
            messageID?: string | null,
            speaker?: foundry.documents.ChatSpeakerData | null
        ): Promise<boolean>;
    };
}

type SlugCamel = "dromedary" | "bactrian" | null;

type CanvasPF2e = Canvas<
    ScenePF2e,
    AmbientLight<AmbientLightDocument<ScenePF2e>>,
    MeasuredTemplatePF2e<MeasuredTemplateDocumentPF2e<ScenePF2e>>,
    TokenPF2e<TokenDocumentPF2e<ScenePF2e>>,
    EffectsCanvasGroupPF2e
>;

declare global {
    const CONFIG: ConfigPF2e;
    const canvas: CanvasPF2e;

    namespace globalThis {
        var game: GamePF2e;
    }

    var ui: FoundryUI<
        ActorDirectoryPF2e,
        ItemDirectory<ItemPF2e<null>>,
        ChatLogPF2e,
        CompendiumDirectoryPF2e,
        EncounterTrackerPF2e<EncounterPF2e | null>,
        HotbarPF2e,
        MacroPF2e
    >;

    class ActiveEffectPF2e<
        TParent extends ActorPF2e | ItemPF2e | null
    > extends ActiveEffect<TParent> {}

    class EffectsCanvasGroupPF2e extends EffectsCanvasGroup {}
    class TileDocumentPF2e<
        TParent extends ScenePF2e | null = ScenePF2e | null
    > extends TileDocument<TParent> {}
    class RegionBehaviorPF2e<
        TParent extends RegionDocument = RegionDocument
    > extends RegionBehavior<TParent> {}

    class MacroPF2e extends Macro {}
}
