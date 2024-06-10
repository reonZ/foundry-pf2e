export {};

declare global {
    abstract class AbstractNPCSheet extends CreatureSheetPF2e<NPCPF2e> {}

    class NPCSheetPF2e extends AbstractNPCSheet {}
}
