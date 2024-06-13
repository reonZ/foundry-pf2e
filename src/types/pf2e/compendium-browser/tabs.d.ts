export {};

declare global {
    abstract class CompendiumBrowserTab {
        browser: CompendiumBrowser;
        filterData: BrowserFilter;
        defaultFilterData: this["filterData"];
        indexData: CompendiumBrowserIndexData[];
        currentIndex: CompendiumBrowserIndexData[];
        isInitialized: boolean;
        totalItemCount: number;
        scrollLimit: number;

        open(filter?: BrowserFilter): Promise<void>;
        filterTraits(
            traits: string[],
            selected: MultiselectData["selected"],
            condition: MultiselectData["conjunction"]
        ): boolean;
        getFilterData(): Promise<this["filterData"]>;
        arrayIncludes(array: string[], other: string[]): boolean;
    }

    class CompendiumBrowserActionTab extends CompendiumBrowserTab {}
    class CompendiumBrowserBestiaryTab extends CompendiumBrowserTab {}
    class CompendiumBrowserCampaignFeaturesTab extends CompendiumBrowserTab {}
    class CompendiumBrowserEquipmentTab extends CompendiumBrowserTab {
        filterData: EquipmentFilters;
    }
    class CompendiumBrowserFeatTab extends CompendiumBrowserTab {
        tabName: "feat";
        filterData: FeatFilters;
    }
    class CompendiumBrowserHazardTab extends CompendiumBrowserTab {}
    class CompendiumBrowserSpellTab extends CompendiumBrowserTab {
        tabName: "spell";
        filterData: SpellFilters;
    }
}
