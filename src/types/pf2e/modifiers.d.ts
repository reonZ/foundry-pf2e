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
        /** A list of tags associated with this modifier */
        tags?: string[];
        /** Hide this modifier in UIs if it is disabled */
        hideIfDisabled?: boolean;
        /** Whether to use this bonus/penalty/modifier even if it isn't the greatest magnitude */
        force?: boolean;
    }

    type PartialParameters = Partial<Omit<DamageDicePF2e, "predicate">> &
        Pick<DamageDicePF2e, "selector" | "slug">;
    interface DamageDiceParameters extends PartialParameters {
        predicate?: RawPredicate;
    }

    interface RawDamageDice extends Required<DamageDiceParameters> {}

    interface TestableDeferredValueParams extends DeferredValueParams {
        test: string[] | Set<string>;
    }

    interface DeferredDamageDiceOptions extends TestableDeferredValueParams {
        selectors: string[];
    }

    interface DeferredValueParams {
        /** An object to merge into roll data for `Roll.replaceFormulaData` */
        resolvables?: Record<string, unknown>;
        /** An object to merge into standard options for `RuleElementPF2e#resolveInjectedProperties` */
        injectables?: Record<string, unknown>;
        /** Roll Options to get against a predicate (if available) */
        test?: string[] | Set<string>;
    }

    type DeferredValue<T> = (options?: DeferredValueParams) => T | null;
    type DeferredPromise<T> = (options?: DeferredValueParams) => Promise<T | null>;

    interface ModifierObjectParams extends RawModifier {
        name?: string;
        rule?: RuleElementPF2e | null;
        alterations?: DamageAlteration[];
    }

    class StatisticModifier {
        declare label?: string;

        constructor(slug: string, modifiers?: ModifierPF2e[], rollOptions?: string[] | Set<string>);
    }

    interface ModifierPF2e extends RawModifier {
        test(options: string[] | Set<string>): void;
        clone(
            data?: Partial<ModifierObjectParams>,
            options?: { test?: Set<string> | string[] }
        ): ModifierPF2e;
    }

    interface DamageDiceOverride {
        /** Upgrade the damage dice to the next higher size (maximum d12) */
        upgrade?: boolean;

        /** Downgrade the damage dice to the next lower size (minimum d4) */
        downgrade?: boolean;

        /** Override with a set dice size */
        dieSize?: DamageDieSize;

        /** Override the damage type */
        damageType?: DamageType;

        /** Override the number of damage dice */
        diceNumber?: number;
    }

    class DamageDicePF2e {
        /** A selector of an actor's associated damaging statistic  */
        selector: string;

        slug: string;
        label: string;
        /** The number of dice to add. */
        diceNumber: number;
        /** The size of the dice to add. */
        dieSize: DamageDieSize | null;
        /**
         * True means the dice are added to critical without doubling; false means the dice are never added to critical
         * damage; omitted means add to normal damage and double on critical damage.
         */
        critical: boolean | null;
        /** The damage category of these dice. */
        category: "persistent" | "precision" | "splash" | null;
        damageType: DamageType | null;
        /** A list of tags associated with this damage */
        tags: string[];
        /** If true, these dice overide the base damage dice of the weapon. */
        override: DamageDiceOverride | null;
        ignored: boolean;
        enabled: boolean;
        predicate: Predicate;
        alterations: DamageAlteration[];
        hideIfDisabled: boolean;
    }

    class CheckModifier extends StatisticModifier {}
}
