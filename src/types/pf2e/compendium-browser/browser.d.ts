export {};

declare global {
    type TabName =
        | "action"
        | "bestiary"
        | "campaignFeature"
        | "equipment"
        | "feat"
        | "hazard"
        | "spell";

    type ContentTabName = Exclude<TabName, "settings">;

    type TabData<T> = Record<TabName, T | null>;

    interface SourceInfo {
        load: boolean;
        name: string;
    }

    type CompendiumBrowserSourcesList = Record<string, SourceInfo | undefined>;
    interface CompendiumBrowserSources {
        ignoreAsGM: boolean;
        showEmptySources: boolean;
        showUnknownSources: boolean;
        sources: CompendiumBrowserSourcesList;
    }

    interface CompendiumBrowserSheetData {
        user: Active<UserPF2e>;
        settings?: { settings: CompendiumBrowserSettings; sources: CompendiumBrowserSources };
        scrollLimit?: number;
        showCampaign: boolean;
    }

    interface BrowserTabs {
        action: CompendiumBrowserActionTab;
        bestiary: CompendiumBrowserBestiaryTab;
        campaignFeature: CompendiumBrowserCampaignFeaturesTab;
        equipment: CompendiumBrowserEquipmentTab;
        feat: CompendiumBrowserFeatTab;
        hazard: CompendiumBrowserHazardTab;
        spell: CompendiumBrowserSpellTab;
    }

    type CompendiumBrowserSettings = Omit<
        TabData<Record<string, PackInfo | undefined>>,
        "settings"
    >;

    class PackLoader {
        loadedSources: string[];
        sourcesSettings: CompendiumBrowserSources;

        loadPacks(
            documentType: "Actor" | "Item",
            packs: string[],
            indexFields: string[]
        ): AsyncGenerator<
            { pack: CompendiumCollection<CompendiumDocument>; index: CompendiumIndex },
            void,
            unknown
        >;
    }

    class CompendiumBrowser extends Application {
        // settings: CompendiumBrowserSettings;
        dataTabsList: TabName[];
        navigationTab: Tabs;
        tabs: BrowserTabs;

        declare activeTab: TabName;
        declare packLoader: PackLoader;

        openTab(name: "action", filter?: ActionFilters): Promise<void>;
        openTab(name: "bestiary", filter?: BestiaryFilters): Promise<void>;
        openTab(name: "equipment", filter?: EquipmentFilters): Promise<void>;
        openTab(name: "feat", filter?: FeatFilters): Promise<void>;
        openTab(name: "hazard", filter?: HazardFilters): Promise<void>;
        openTab(name: "spell", filter?: SpellFilters): Promise<void>;
        openTab(name: "settings"): Promise<void>;
        openTab(tabName: TabName, filter?: BrowserFilter): Promise<void>;

        loadedPacks(tab: TabName): string[];
    }
}
