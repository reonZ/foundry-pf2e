declare function resolveMacroActor(uuid?: ActorUUID): ActorPF2e | null;
declare function openAttackpopup(actor: CharacterPF2e, { elementTrait, itemId, slug, type }: RollActionMacroParams): void;
interface RollActionMacroParams {
    itemId?: string;
    slug?: string;
    elementTrait?: ElementTrait;
    type?: "blast" | "strike";
}
export { openAttackpopup, resolveMacroActor };
