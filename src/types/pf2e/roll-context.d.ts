export {};

declare global {
    interface RollOrigin<
        TActor extends ActorPF2e | null = ActorPF2e | null,
        TStatistic extends Statistic | StrikeData | null = Statistic | StrikeData | null,
        TItem extends ItemPF2e<ActorPF2e> | null = ItemPF2e<ActorPF2e> | null
    > {
        actor: TActor;
        token: TokenDocumentPF2e | null;
        /** The statistic in use if the origin is rolling */
        statistic: TStatistic | null;
        /** Whether the origin is also the roller: usually the case unless a saving throw */
        self: boolean;
        /** The item used for the strike */
        item: TItem;
        /** Bonuses and penalties added at the time of a check */
        modifiers: ModifierPF2e[];
    }

    interface RollTarget {
        actor: ActorPF2e | null;
        token: TokenDocumentPF2e | null;
        /** The statistic in use if the target is rolling */
        statistic: Statistic | null;
        /** Whether the target is also the roller: usually not the case unless a saving throw */
        self: boolean;
        item: ItemPF2e<ActorPF2e> | null;
        distance: number | null;
        rangeIncrement: number | null;
    }
}
