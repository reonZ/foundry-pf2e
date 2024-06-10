export {};

declare global {
    interface ArmorStatisticData extends StatisticData {
        rank?: ZeroToFour;
        details?: string;
    }

    interface ArmorClassTraceData<
        TAttribute extends AttributeString | null = AttributeString | null
    > extends StatisticTraceData<TAttribute> {
        details: string;
        slug: "ac";
    }

    class ArmorStatistic<TActor extends ActorPF2e = ActorPF2e> extends Statistic<TActor> {}
}
