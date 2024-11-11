declare function rollDamageFromFormula(actor: ActorPF2e, formula: string, { actionName, item, token, target }?: RollDamageExtraOptions): Promise<ChatMessage>;
type RollDamageExtraOptions = {
    item?: ItemPF2e;
    token?: TokenPF2e;
    actionName?: string;
    target?: {
        actor: string;
        token?: string;
    };
};
export type { RollDamageExtraOptions };
export { rollDamageFromFormula };
