export {};

declare global {
    type ModifierType =
        | "untyped"
        | "item"
        | "ability"
        | "circumstance"
        | "potency"
        | "proficiency"
        | "status";

    interface ModifierAdjustment {
        /** A slug for matching against modifiers: `null` will match against all modifiers within a selector */
        slug: string | null;
        test: (options: string[] | Set<string>) => boolean;
        damageType?: DamageType;
        relabel?: string;
        suppress?: boolean;
        getNewValue?: (current: number) => number;
        getDamageType?: (current: DamageType | null) => DamageType | null;
    }

    interface RawModifier {
        /** An identifier for this modifier; should generally be a localization key (see en.json). */
        slug?: string;
        /** The domains of discourse to which this modifier belongs */
        domains?: string[];
        /** The display name of this modifier; can be a localization key (see en.json). */
        label: string;
        /** The actual numeric benefit/penalty that this modifier provides. */
        modifier: number;
        /** The type of this modifier - modifiers of the same type do not stack (except for `untyped` modifiers). */
        type?: ModifierType;
        /** If the type is "ability", this should be set to a particular ability */
        ability?: AttributeString | null;
        /** Numeric adjustments to apply */
        adjustments?: ModifierAdjustment[];
        /** If true, this modifier will be applied to the final roll; if false, it will be ignored. */
        enabled?: boolean;
        /** If true, these custom dice are being ignored in the damage calculation. */
        ignored?: boolean;
        /** The source from which this modifier originates, if any. */
        source?: string | null;
        /** If true, this modifier is a custom player-provided modifier. */
        custom?: boolean;
        /** The damage type that this modifier does, if it modifies a damage roll. */
        damageType?: DamageType | null;
        /** The damage category */
        damageCategory?: DamageCategoryUnique | null;
        /** A predicate which determines when this modifier is active. */
        predicate?: RawPredicate;
        /** If true, this modifier is only active on a critical hit. */
        critical?: boolean | null;
        /** The list of traits that this modifier gives to the underlying attack, if any. */
        traits?: string[];
        /** Hide this modifier in UIs if it is disabled */
        hideIfDisabled?: boolean;
        /** Whether to use this bonus/penalty/modifier even if it isn't the greatest magnitude */
        force?: boolean;
    }

    interface ModifierObjectParams extends RawModifier {
        name?: string;
        rule?: RuleElementPF2e | null;
        alterations?: DamageAlteration[];
    }

    class StatisticModifier {
        declare label?: string;
    }

    interface ModifierPF2e extends RawModifier {
        clone(
            data?: Partial<ModifierObjectParams>,
            options?: { test?: Set<string> | string[] }
        ): ModifierPF2e;
    }

    class DamageDicePF2e {}
}
