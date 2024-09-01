export {};

declare global {
    interface RollActionMacroParams {
        actorUUID?: ActorUUID;
        itemId?: string;
        slug?: string;
        elementTrait?: EffectTrait;
        type?: "blast" | "strike";
    }
}
