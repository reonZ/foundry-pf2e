export {};

declare global {
    class InventoryBulk {}

    class ActorInitiative {}

    class ActorInventory<TActor extends ActorPF2e> extends DelegatedCollection<
        PhysicalItemPF2e<TActor>
    > {
        actor: TActor;
        bulk: InventoryBulk;

        get coins(): CoinsPF2e;
        get totalWealth(): CoinsPF2e;
        get invested(): { value: number; max: number } | null;

        findStackableItem(item: PhysicalItemPF2e | ItemSourcePF2e): PhysicalItemPF2e<TActor> | null;
    }

    class ActorConditions<TActor extends ActorPF2e> extends DelegatedCollection<
        ConditionPF2e<TActor>
    > {}
}
