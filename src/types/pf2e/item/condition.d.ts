export {};

declare global {
    type ConditionSource = BaseItemSourcePF2e<"condition", ConditionSystemSource>;

    interface ConditionSystemSource extends AbstractEffectSystemSource {
        slug: ConditionSlug;
        references: {
            parent?: {
                id: string;
                type: string;
            };
            children: { id: string; type: "condition" }[];
            overriddenBy: { id: string; type: "condition" }[];
            overrides: { id: string; type: "condition" }[];
        };
        duration: { value: number };
        persistent?: PersistentSourceData;
        group: string | null;
        value: ConditionValueData;
        overrides: string[];
        context?: never;
        level?: never;
    }

    interface PersistentSourceData {
        formula: string;
        damageType: DamageType;
        dc: number;
        /** Whether this damage was multiplied due to a critical hit */
        criticalHit?: boolean;
    }

    interface ConditionSystemData
        extends Omit<ConditionSystemSource, "description" | "fromSpell">,
            Omit<AbstractEffectSystemData, "level" | "slug"> {
        persistent?: PersistentDamageData;
        duration: DurationData;
    }

    interface PersistentDamageData extends PersistentSourceData {
        damage: DamageRoll;
        expectedValue: number;
    }

    type ConditionSlug = string;
    type DetectionConditionType = "hidden" | "observed" | "undetected" | "unnoticed";
    type ConditionKey = ConditionSlug | `persistent-damage-${string}`;

    type ConditionValueData = { isValued: true; value: number } | { isValued: false; value: null };

    class ConditionPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends AbstractEffectPF2e<TParent> {
        declare active: boolean;
    }

    interface ConditionPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends AbstractEffectPF2e<TParent> {
        readonly _source: ConditionSource;
        system: ConditionSystemData;

        get slug(): ConditionSlug;
    }
}
