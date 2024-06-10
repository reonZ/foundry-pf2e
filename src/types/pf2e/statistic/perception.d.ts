export {};

declare global {
    class PerceptionStatistic<TActor extends ActorPF2e = ActorPF2e> extends Statistic<TActor> {
        /** Special senses possessed by the actor */
        senses: Collection<Sense>;
        /** Whether the actor has standard vision */
        hasVision: boolean;
    }

    interface PerceptionStatisticData extends StatisticData {
        senses: SenseData[];
        vision?: boolean;
        details?: string;
    }

    type LabeledSenseData = Required<SenseData> & {
        label: string | null;
    };

    interface PerceptionTraceData<
        TAttribute extends AttributeString | null = AttributeString | null
    > extends StatisticTraceData<TAttribute> {
        /** Unusual senses or other perception-related notes */
        details: string;
        senses: LabeledSenseData[];
        /** Whether the creature has standard vision */
        vision: boolean;
    }
}
