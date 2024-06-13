declare function getTemplateTokens(measuredTemplate: MeasuredTemplateDocumentPF2e | MeasuredTemplatePF2e, { collisionOrigin, collisionType, }?: {
    collisionOrigin?: PIXI.Point;
    collisionType?: "move";
}): TokenPF2e<TokenDocumentPF2e<ScenePF2e | null>>[];
export { getTemplateTokens };
