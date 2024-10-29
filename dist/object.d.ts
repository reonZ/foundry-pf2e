declare function isInstanceOf<T extends IsInstanceOfType>(obj: any, cls: T): obj is IsInstanceOfClasses[T];
declare function isInstanceOf<T>(obj: any, cls: string): obj is T;
declare function rollDie(faces: number, nb?: number): number;
declare function getInMemory<T>(obj: object, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: object, ...args: [...string[], T]): boolean;
declare function getInMemoryAndSetIfNot<T>(obj: object, ...args: [...string[], (() => T) | T]): T;
declare function deleteInMemory(obj: object, ...path: string[]): boolean;
type IsInstanceOfClasses = {
    TokenDocumentPF2e: TokenDocumentPF2e;
    CreatureConfig: CreatureConfig;
    ConsumablePF2e: ConsumablePF2e;
    DamageRoll: DamageRoll;
    EffectPF2e: EffectPF2e;
    LootPF2e: LootPF2e;
    ActorPF2e: ActorPF2e;
    ItemPF2e: ItemPF2e;
};
type IsInstanceOfType = keyof IsInstanceOfClasses;
export { getInMemory, deleteInMemory, getInMemoryAndSetIfNot, isInstanceOf, rollDie, setInMemory };
