declare function renderCharacterSheets(): void;
declare function renderActorSheets(type: ActorSheetType): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
declare function refreshApplicationHeight(app: Maybe<Application>): void;
type ActorSheetType = "CharacterSheetPF2e" | "LootSheetPF2e";
type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e";
export { refreshApplicationHeight, renderActorSheets, renderCharacterSheets, renderItemSheets };
