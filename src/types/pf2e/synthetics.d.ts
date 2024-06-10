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
        tokenOverrides: DeepPartial<Pick<TokenSource, "light" | "name" | "alpha">> & {
            texture?:
                | { src: VideoFilePath; tint?: Color }
                | { src: VideoFilePath; tint?: Color; scaleX: number; scaleY: number };
        };
        weaponPotency: Record<string, PotencySynthetic[]>;
    }
}
