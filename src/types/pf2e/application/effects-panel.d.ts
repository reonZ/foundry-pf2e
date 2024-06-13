export {};

declare global {
    class EffectsPanel extends Application {
        get token(): TokenDocumentPF2e | null;
        get actor(): ActorPF2e | null;

        refresh(force?: boolean | undefined, options?: RenderOptions | undefined): void;
    }
}
