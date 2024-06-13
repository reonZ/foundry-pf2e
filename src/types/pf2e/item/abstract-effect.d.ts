export {};

declare global {
    interface AbstractEffectSystemSource extends ItemSystemSource {
        traits: EffectTraits;
        /** Whether this effect originated from a spell */
        fromSpell?: boolean;
        expired?: boolean;
    }

    interface AbstractEffectSystemData extends ItemSystemData {
        traits: EffectTraits;
        /** Whether this effect originated from a spell */
        fromSpell: boolean;
    }

    interface EffectBadgeBaseSource {
        labels?: string[];
    }

    interface EffectBadgeBase extends EffectBadgeBaseSource {
        label: string | null;
    }

    interface EffectBadgeCounterSource extends EffectBadgeBaseSource {
        type: "counter";
        min?: number;
        max?: number;
        value: number;
        loop?: boolean;
    }

    interface EffectBadgeCounter extends EffectBadgeCounterSource, EffectBadgeBase {
        min: number;
        max: number;
    }

    type EffectTrait = string;

    interface EffectTraits extends ItemTraitsNoRarity<EffectTrait> {}

    /** A static value, including the result of a formula badge */
    interface EffectBadgeValueSource extends EffectBadgeBaseSource {
        type: "value";
        value: number;
        reevaluate?: {
            /** The type of event that reevaluation should occur */
            event: BadgeReevaluationEventType;
            /** The formula of this badge when it was of a "formula" type */
            formula: string;
            /** The initial value of this badge */
            initial?: number;
        } | null;
        min?: never;
        max?: never;
    }

    interface EffectBadgeValue
        extends Omit<EffectBadgeValueSource, "min" | "max">,
            EffectBadgeBase {
        min: number;
        max: number;
    }

    interface EffectBadgeFormulaSource extends EffectBadgeBaseSource {
        type: "formula";
        value: string;
        evaluate?: boolean;
        reevaluate?: BadgeReevaluationEventType | null;
        min?: never;
        max?: never;
    }

    type BadgeReevaluationEventType = "initiative-roll" | "turn-start" | "turn-end";

    interface EffectBadgeFormula extends EffectBadgeFormulaSource, EffectBadgeBase {}

    interface EffectContextData {
        origin: {
            actor: ActorUUID;
            token: TokenDocumentUUID | null;
            item: ItemUUID | null;
            spellcasting: EffectContextSpellcastingData | null;
            rollOptions?: string[];
        };
        target: {
            actor: ActorUUID;
            token: TokenDocumentUUID | null;
        } | null;
        roll: Pick<CheckRoll, "total" | "degreeOfSuccess"> | null;
    }

    interface EffectContextSpellcastingData {
        attribute: { type: AttributeString; mod: number };
        tradition: MagicTradition | null;
    }

    interface EffectAuraData {
        slug: string;
        origin: ActorUUID;
        removeOnExit: boolean;
    }

    type EffectBadgeSource =
        | EffectBadgeCounterSource
        | EffectBadgeValueSource
        | EffectBadgeFormulaSource;
    type EffectBadge = EffectBadgeCounter | EffectBadgeValue | EffectBadgeFormula;

    type TimeUnit = "rounds" | "minutes" | "hours" | "days";
    type EffectExpiryType = "turn-start" | "turn-end" | "round-end";

    interface DurationData {
        value: number;
        unit: TimeUnit | "unlimited" | "encounter";
        expiry: EffectExpiryType | null;
    }

    abstract class AbstractEffectPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {
        get badge(): EffectBadge | null;
        get origin(): ActorPF2e | null;
        get traits(): Set<EffectTrait>;
        get isIdentified(): boolean;
        get isLocked(): boolean;
        get fromSpell(): boolean;
        get totalDuration(): number;
        get remainingDuration(): { expired: boolean; remaining: number };

        increase(): Promise<void>;
        decrease(): Promise<void>;
    }

    interface AbstractEffectPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: AfflictionSource | ConditionSource | EffectSource;
        system: AfflictionSystemData | ConditionSystemData | EffectSystemData;
    }
}
