export {};

declare global {
    class LootSheetPF2e<TActor extends LootPF2e = LootPF2e> extends ActorSheetPF2e<TActor> {}

    interface LootSheetDataPF2e<TActor extends LootPF2e = LootPF2e>
        extends ActorSheetDataPF2e<TActor> {
        isLoot: boolean;
        lootSheetTypeOptions: FormSelectOption[];
    }
}
