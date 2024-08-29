declare function filterTraits(traits: string[], selected: MultiselectData["selected"], condition: MultiselectData["conjunction"]): boolean;
declare function getCompendiumFilters<T extends keyof BrowserTabs>(tab: T, init?: boolean): Promise<BrowserTabs[T]["filterData"]>;
export { filterTraits, getCompendiumFilters };
