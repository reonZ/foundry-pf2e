export {};

declare global {
    type EffectSource = BaseItemSourcePF2e<"effect", EffectSystemSource> & {
        flags: DeepPartial<EffectFlags>;
    };

    type EffectFlags = ItemFlagsPF2e & {
        pf2e: {
            aura?: EffectAuraData;
        };
    };

    interface EffectSystemSource extends AbstractEffectSystemSource {
        level: { value: number };
        start: {
            value: number;
            initiative: number | null;
        };
        duration: DurationData & {
            sustained: boolean;
        };
        tokenIcon: {
            show: boolean;
        };
        unidentified: boolean;
        /** A numeric value or dice expression of some rules significance to the effect */
        badge: EffectBadgeSource | null;
        /** Origin, target, and roll context of the action that spawned this effect */
        context: EffectContextData | null;
    }

    interface EffectSystemData
        extends Omit<EffectSystemSource, "badge" | "description" | "fromSpell">,
            Omit<AbstractEffectSystemData, "level"> {
        expired: boolean;
        badge: EffectBadge | null;
        remaining: string;
    }

    class EffectPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends AbstractEffectPF2e<TParent> {
        get level(): number;
        get isExpired(): boolean;
        get isAura(): boolean;
        get fromAura(): boolean;

        onEncounterEvent(event: BadgeReevaluationEventType): Promise<void>;
    }

    interface EffectPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends AbstractEffectPF2e<TParent> {
        flags: EffectFlags;
        readonly _source: EffectSource;
        system: EffectSystemData;
    }
}
