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

    class CompendiumBrowser extends Application {
        // settings: CompendiumBrowserSettings;
        dataTabsList: TabName[];
        navigationTab: Tabs;
        tabs: BrowserTabs;

        declare activeTab: TabName;

        openTab(name: "action", filter?: ActionFilters): Promise<void>;
        openTab(name: "bestiary", filter?: BestiaryFilters): Promise<void>;
        openTab(name: "equipment", filter?: EquipmentFilters): Promise<void>;
        openTab(name: "feat", filter?: FeatFilters): Promise<void>;
        openTab(name: "hazard", filter?: HazardFilters): Promise<void>;
        openTab(name: "spell", filter?: SpellFilters): Promise<void>;
        openTab(name: "settings"): Promise<void>;
        openTab(tabName: TabName, filter?: BrowserFilter): Promise<void>;
    }
}
