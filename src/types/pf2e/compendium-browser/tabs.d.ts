export {};

declare global {
    type SearchOptions = {
        fields?: string[];
        filter?: (result: SearchResult) => boolean;
        boost?: {
            [fieldName: string]: number;
        };
        weights?: {
            fuzzy: number;
            prefix: number;
        };
        boostDocument?: (
            documentId: any,
            term: string,
            storedFields?: Record<string, unknown>
        ) => number;
        prefix?: boolean | ((term: string, index: number, terms: string[]) => boolean);
        fuzzy?:
            | boolean
            | number
            | ((term: string, index: number, terms: string[]) => boolean | number);
        maxFuzzy?: number;
        combineWith?: string;
        tokenize?: (text: string) => string[];
        processTerm?: (term: string) => string | string[] | null | undefined | false;
        // bm25?: BM25Params;
    };

    type QueryCombination = SearchOptions & {
        queries: Query[];
    };

    type Wildcard = typeof MiniSearch.wildcard;

    type Query = QueryCombination | string | Wildcard;

    class MiniSearch<TIndexData extends CompendiumBrowserIndexData = CompendiumBrowserIndexData> {
        static readonly wildcard: unique symbol;

        search(query: Query, searchOptions?: SearchOptions): TIndexData[];
    }

    abstract class CompendiumBrowserTab<
        TIndexData extends CompendiumBrowserIndexData = CompendiumBrowserIndexData
    > {
        tabName: TabName;
        browser: CompendiumBrowser;
        filterData: BrowserFilter;
        defaultFilterData: this["filterData"];
        indexData: TIndexData[];
        currentIndex: TIndexData[];
        isInitialized: boolean;
        totalItemCount: number;
        scrollLimit: number;
        searchEngine: MiniSearch<TIndexData>;

        abstract templatePath: string;
        abstract filterIndexData(entry: TIndexData): boolean;

        open(filter?: BrowserFilter): Promise<void>;

        filterTraits(
            traits: string[],
            selected: MultiselectData["selected"],
            condition: MultiselectData["conjunction"]
        ): boolean;

        getFilterData(): Promise<this["filterData"]>;

        getIndexData(start: number): TIndexData[];

        arrayIncludes(array: string[], other: string[]): boolean;

        generateSourceCheckboxOptions(sources: Set<string>): CheckboxOptions;

        generateMultiselectOptions<T extends string>(
            optionsRecord: Record<T, string>,
            sort?: boolean
        ): { value: T; label: string }[];
        generateMultiselectOptions(
            optionsRecord: Record<string, string>,
            sort?: boolean
        ): { value: string; label: string }[];

        generateCheckboxOptions(
            configData: Record<string, string | { label: string }>,
            sort?: boolean
        ): CheckboxOptions;

        sortResult(result: TIndexData[]): TIndexData[];
    }

    interface CompendiumBrowserActionTab extends CompendiumBrowserTab {}

    type CompendiumBrowserBestiaryTabIndexData = {
        actorSize: Size;
        img: string;
        level: number;
        name: string;
        originalName: string | undefined;
        rarity: string;
        source: string;
        traits: string[];
        type: ActorType;
        uuid: CompendiumUUID;
    };

    interface CompendiumBrowserBestiaryTab
        extends CompendiumBrowserTab<CompendiumBrowserBestiaryTabIndexData> {
        filterData: BestiaryFilters;
        index: string[];

        hasAllIndexFields(data: CompendiumIndexData, indexFields: string[]): boolean;
    }

    interface CompendiumBrowserCampaignFeaturesTab extends CompendiumBrowserTab {}

    interface CompendiumBrowserEquipmentTab extends CompendiumBrowserTab {
        filterData: EquipmentFilters;
    }

    interface CompendiumBrowserFeatTab extends CompendiumBrowserTab {
        tabName: "feat";
        filterData: FeatFilters;
    }

    interface CompendiumBrowserHazardTab extends CompendiumBrowserTab {}

    interface CompendiumBrowserSpellTab extends CompendiumBrowserTab {
        tabName: "spell";
        filterData: SpellFilters;
    }
}
