declare function isInstanceOf<T extends IsInstanceOfType>(obj: any, cls: T): obj is IsInstanceOfClasses[T];
declare function isInstanceOf<T>(obj: any, cls: string): obj is T;
declare function rollDie(faces: number, nb?: number): number;
declare function getInMemory<T>(obj: object, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: object, ...args: [...string[], T]): boolean;
declare function getInMemoryAndSetIfNot<T>(obj: object, ...args: [...string[], (() => T) | T]): T;
declare function deleteInMemory(obj: object, ...path: string[]): boolean;
type IsInstanceOfClasses = IsInstanceOfItems & {
    TokenDocumentPF2e: TokenDocumentPF2e;
    CreatureConfig: CreatureConfig;
    DamageRoll: DamageRoll;
    LootPF2e: LootPF2e;
    ActorPF2e: ActorPF2e;
    ChatMessagePF2e: ChatMessagePF2e;
};
type IsInstanceOfItems = {
    ItemPF2e: ItemPF2e;
    EffectPF2e: EffectPF2e;
    FeatPF2e: FeatPF2e;
    SpellPF2e: SpellPF2e;
    ConsumablePF2e: ConsumablePF2e;
    SpellcastingEntryPF2e: SpellcastingEntryPF2e;
};
type IsInstanceOfItem = keyof IsInstanceOfItems;
type IsInstanceOfType = keyof IsInstanceOfClasses;
export type { IsInstanceOfClasses, IsInstanceOfItems, IsInstanceOfItem, IsInstanceOfType };
export { getInMemory, deleteInMemory, getInMemoryAndSetIfNot, isInstanceOf, rollDie, setInMemory };
