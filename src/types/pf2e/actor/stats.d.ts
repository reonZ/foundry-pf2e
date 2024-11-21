export {};

declare global {
    class InventoryBulk {
        actor: ActorPF2e;
        encumberedAfterAddend: number;
        maxAddend: number;

        static computeTotalBulk(items: PhysicalItemPF2e[], actorSize: Size): Bulk;

        get encumberedAfter(): number;
        get encumberedAfterBreakdown(): string;
        get max(): number;
        get maxBreakdown(): string;
        get value(): Bulk;
        get encumberedPercentage(): number;
        get maxPercentage(): number;
        get maxPercentageInteger(): number;
        get isEncumbered(): boolean;
        get isOverMax(): boolean;
        get bulk(): number;
    }

    class ActorInitiative {
        constructor(actor: ActorPF2e, options: { statistic: string; tiebreakPriority: ZeroToTwo });

        roll(args?: InitiativeRollParams): Promise<InitiativeRollResult | null>;
    }

    interface AddItemOptions {
        stack?: boolean;
    }

    class ActorInventory<TActor extends ActorPF2e> extends DelegatedCollection<
        PhysicalItemPF2e<TActor>
    > {
        actor: TActor;
        bulk: InventoryBulk;

        get coins(): CoinsPF2e;
        get totalWealth(): CoinsPF2e;
        get invested(): { value: number; max: number } | null;

        addCoins(coins: Partial<Coins>, options?: { combineStacks?: boolean }): Promise<void>;
        removeCoins(coins: Partial<Coins>, options?: { byValue?: boolean }): Promise<boolean>;
        findStackableItem(item: PhysicalItemPF2e | ItemSourcePF2e): PhysicalItemPF2e<TActor> | null;

        /** Adds one or more items to this inventory without removing from its original location */
        add(
            itemOrItems:
                | PhysicalItemPF2e
                | KitPF2e
                | PreCreate<PhysicalItemSource | KitSource>
                | (PhysicalItemPF2e | KitPF2e | PreCreate<PhysicalItemSource | KitSource>)[],
            options?: AddItemOptions
        ): Promise<void>;
    }

    interface ConditionsGetOptions extends CollectionGetOptions {
        /** Filter by the active state of the condition: `null` will return one in either state */
        active?: boolean | null;
        /**
         * Filter by the whether the condition is temporary (in-memory) or stored on the actor: `null` will return
         * a condition of either kind
         */
        temporary?: boolean | null;
    }

    class ActorConditions<TActor extends ActorPF2e> extends DelegatedCollection<
        ConditionPF2e<TActor>
    > {
        get active(): ConditionPF2e<TActor>[];
        get stored(): ConditionPF2e<TActor>[];
        get clumsy(): ConditionPF2e<TActor> | null;
        get doomed(): ConditionPF2e<TActor> | null;
        get drained(): ConditionPF2e<TActor> | null;
        get dying(): ConditionPF2e<TActor> | null;
        get enfeebled(): ConditionPF2e<TActor> | null;
        get frightened(): ConditionPF2e<TActor> | null;
        get sickened(): ConditionPF2e<TActor> | null;
        get slowed(): ConditionPF2e<TActor> | null;
        get stunned(): ConditionPF2e<TActor> | null;
        get stupefied(): ConditionPF2e<TActor> | null;
        get wounded(): ConditionPF2e<TActor> | null;

        hasType(slug: ConditionSlug): boolean;
        finalize(): void;

        get(
            key: Maybe<string>,
            options: { strict: true; active?: boolean | null; temporary?: boolean | null }
        ): ConditionPF2e<TActor>;
        get(key: string, options?: ConditionsGetOptions): ConditionPF2e<TActor> | undefined;
        get(key: string, options?: ConditionsGetOptions): ConditionPF2e<TActor> | undefined;

        every(condition: (value: ConditionPF2e<TActor>) => boolean): boolean;

        bySlug(
            slug: "persistent-damage",
            options?: ConditionsBySlugOptions
        ): PersistentDamagePF2e<TActor>[];
        bySlug(slug: "dead", options?: ConditionsBySlugOptions): never[];
        bySlug(
            slug: ConditionSlug | "dead",
            options?: ConditionsBySlugOptions
        ): ConditionPF2e<TActor>[];
        bySlug(slug: string, options?: ConditionsBySlugOptions): ConditionPF2e<TActor>[];
    }

    type ConditionsBySlugOptions = Omit<ConditionsGetOptions, "strict">;
}
