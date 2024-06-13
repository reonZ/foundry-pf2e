declare function renderCharacterSheets(): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
declare function refreshApplicationHeight(app: Maybe<Application>): void;
type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "LootSheetPF2e";
export { refreshApplicationHeight, renderCharacterSheets, renderItemSheets };
