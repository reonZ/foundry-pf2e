declare function rollDamageFromFormula(formula: string, { actionName, item, origin, target }?: RollDamageExtraOptions): Promise<ChatMessage>;
type RollDamageExtraOptions = {
    item?: ItemPF2e;
    actionName?: string;
    origin?: TargetDocuments;
    target?: TargetDocuments;
};
export type { RollDamageExtraOptions };
export { rollDamageFromFormula };
