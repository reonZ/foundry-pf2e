import { RollNotePF2e } from "../../pf2e";

export {};

declare global {
    interface RollSubstitution {
        slug: string;
        label: string;
        predicate: Predicate;
        value: number;
        required: boolean;
        selected: boolean;
        effectType: "fortune" | "misfortune";
    }

    interface RollOptionToggle {
        /** The ID of the item with a rule element for this toggle */
        itemId: string;
        label: string;
        placement: string;
        domain: string;
        option: string;
        suboptions: Suboption[];
        alwaysActive: boolean;
        checked: boolean;
        enabled: boolean;
    }

    type CritSpecEffect = (DamageDicePF2e | ModifierPF2e | RollNotePF2e)[];
    type CritSpecSynthetic = (
        weapon: WeaponPF2e | MeleePF2e,
        options: Set<string>
    ) => CritSpecEffect | null;

    type DamageDiceSynthetics = { damage: DeferredDamageDice[] } & Record<
        string,
        DeferredDamageDice[] | undefined
    >;
    type ModifierSynthetics = Record<"all" | "damage", DeferredModifier[]> &
        Record<string, DeferredModifier[] | undefined>;
    type ModifierAdjustmentSynthetics = {
        all: ModifierAdjustment[];
        damage: ModifierAdjustment[];
    } & Record<string, ModifierAdjustment[] | undefined>;
    type DeferredModifier = DeferredValue<ModifierPF2e>;
    type DeferredDamageDice = (args: DeferredDamageDiceOptions) => DamageDicePF2e | null;
    type DeferredMovementType = DeferredValue<BaseSpeedSynthetic | null>;
    type DeferredEphemeralEffect = DeferredPromise<EffectSource | ConditionSource | null>;
    type DeferredStrike = (runes?: WeaponRuneSource) => WeaponPF2e<ActorPF2e> | null;

    interface BaseSpeedSynthetic extends Omit<LabeledSpeed, "label" | "type"> {
        type: MovementType;
        /**
         * Whether this speed is derived from a creature's land speed:
         * used as a cue to prevent double-application of modifiers
         */
        derivedFromLand: boolean;
    }

    interface RuleElementSynthetics {
        criticalSpecializations: {
            standard: CritSpecSynthetic[];
            alternate: CritSpecSynthetic[];
        };
        damageAlterations: Record<string, DamageAlteration[]>;
        damageDice: DamageDiceSynthetics;
        degreeOfSuccessAdjustments: Record<string, DegreeOfSuccessAdjustment[]>;
        dexterityModifierCaps: DexterityModifierCapData[];
        ephemeralEffects: Record<
            string,
            { target: DeferredEphemeralEffect[]; origin: DeferredEphemeralEffect[] } | undefined
        >;
        modifierAdjustments: ModifierAdjustmentSynthetics;
        modifiers: ModifierSynthetics;
        movementTypes: { [K in MovementType]?: DeferredMovementType[] };
        multipleAttackPenalties: Record<string, MAPSynthetic[]>;
        rollNotes: Record<string, RollNotePF2e[]>;
        rollSubstitutions: Record<string, RollSubstitution[]>;
        rollTwice: Record<string, RollTwiceSynthetic[]>;
        senses: SenseSynthetic[];
        statistics: Map<string, Statistic>;
        strikeAdjustments: StrikeAdjustment[];
        strikes: DeferredStrike[];
        striking: Record<string, StrikingSynthetic[]>;
        toggles: Record<string, Record<string, RollOptionToggle>>;
        tokenEffectIcons: TokenEffect[];
        tokenMarks: Map<TokenDocumentUUID, string>;
        tokenOverrides: DeepPartial<
            Pick<foundry.documents.TokenSource, "light" | "name" | "alpha">
        > & {
            texture?:
                | { src: VideoFilePath; tint?: Color }
                | { src: VideoFilePath; tint?: Color; scaleX: number; scaleY: number };
        };
        weaponPotency: Record<string, PotencySynthetic[]>;
    }

    interface SenseSynthetic {
        sense: Required<SenseData>;
        predicate: Predicate;
        force: boolean;
    }

    interface StrikeAdjustment {
        adjustDamageRoll?: (
            weapon: WeaponPF2e | MeleePF2e,
            { materials }: { materials?: Set<MaterialDamageEffect> }
        ) => void;
        adjustWeapon?: (weapon: WeaponPF2e | MeleePF2e) => void;
        adjustTraits?: (weapon: WeaponPF2e | MeleePF2e, traits: AbilityTrait[]) => void;
    }

    interface StrikingSynthetic {
        label: string;
        bonus: number;
        predicate: Predicate;
    }

    interface PotencySynthetic {
        label: string;
        bonus: number;
        type: "item" | "potency";
        predicate: Predicate;
        property?: WeaponPropertyRuneType[];
    }

    interface RollTwiceSynthetic {
        keep: "higher" | "lower";
        predicate?: Predicate;
    }

    interface MAPSynthetic {
        label: string;
        penalty: number;
        predicate: Predicate;
    }
}
