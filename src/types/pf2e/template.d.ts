export {};

declare global {
    class MeasuredTemplateDocumentPF2e<
        TParent extends ScenePF2e | null = ScenePF2e | null
    > extends MeasuredTemplateDocument<TParent> {}

    class MeasuredTemplatePF2e<
        TDocument extends MeasuredTemplateDocumentPF2e<ScenePF2e | null> = MeasuredTemplateDocumentPF2e<ScenePF2e | null>
    > extends MeasuredTemplate<TDocument> {}
}
