export {};

declare global {
    class MeasuredTemplateDocumentPF2e<
        TParent extends ScenePF2e | null = ScenePF2e | null
    > extends MeasuredTemplateDocument<TParent> {
        get actor(): ActorPF2e | null;
        get item(): ItemPF2e<ActorPF2e> | null;
        get message(): ChatMessagePF2e | null;
        get areaShape(): EffectAreaShape | null;
    }

    class MeasuredTemplatePF2e<
        TDocument extends MeasuredTemplateDocumentPF2e<ScenePF2e | null> = MeasuredTemplateDocumentPF2e<ScenePF2e | null>
    > extends MeasuredTemplate<TDocument> {}
}
