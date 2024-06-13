export {};

declare global {
    interface SceneFlagsPF2e extends DocumentFlags {
        pf2e: {
            [key: string]: unknown;
            hearingRange: number | null;
            /** Rules-based vision override for the scene: `null` indicates the world setting is used. */
            rulesBasedVision: boolean | null;
            syncDarkness: "enabled" | "disabled" | "default";
            /** The global terrain types for this scene */
            environmentTypes?: EnvironmentType[];
        };
    }

    enum LightLevels {
        DARKNESS = 1 / 4,
        BRIGHT_LIGHT = 3 / 4,
    }

    type LightLevel = ZeroToTwo;
    type EnvironmentType = keyof typeof CONFIG.PF2E.environmentTypes;

    class AmbientLightDocumentPF2e<
        TParent extends ScenePF2e | null = ScenePF2e | null
    > extends AmbientLightDocument<TParent> {
        // Still exists if we need it later, but slated for removal once V12 is fully out
    }

    interface AmbientLightDocumentPF2e<TParent extends ScenePF2e | null = ScenePF2e | null>
        extends AmbientLightDocument<TParent> {
        get object(): AmbientLightPF2e<this> | null;
    }

    class SceneConfigPF2e<TDocument extends ScenePF2e> extends SceneConfig<TDocument> {}

    class ScenePF2e extends Scene {}

    interface ScenePF2e extends Scene {
        flags: SceneFlagsPF2e;

        /** Check for auras containing newly-placed or moved tokens (added as a debounced method) */
        checkAuras(): void;

        _sheet: SceneConfigPF2e<this> | null;

        readonly lights: foundry.abstract.EmbeddedCollection<AmbientLightDocumentPF2e<this>>;
        readonly templates: foundry.abstract.EmbeddedCollection<MeasuredTemplateDocumentPF2e<this>>;
        readonly tokens: foundry.abstract.EmbeddedCollection<TokenDocumentPF2e<this>>;
        readonly tiles: foundry.abstract.EmbeddedCollection<TileDocumentPF2e<this>>;

        get sheet(): SceneConfigPF2e<this>;
    }
}
