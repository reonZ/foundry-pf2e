export {};

declare global {
    type DamageCategoryUnique = "precision" | "splash" | "persistent";
    type DamageCategory =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "energy"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "physical"
        | "siccatite"
        | "silver"
        | "precision"
        | "splash"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass"
        | "persistent";
    type DamageDiceFaces = 8 | 6 | 4 | 10 | 12;
    type DamageDieSize = "d10" | "d12" | "d4" | "d6" | "d8";
    type DamageType =
        | "acid"
        | "bleed"
        | "bludgeoning"
        | "cold"
        | "electricity"
        | "fire"
        | "force"
        | "mental"
        | "piercing"
        | "poison"
        | "slashing"
        | "sonic"
        | "spirit"
        | "vitality"
        | "void"
        | "untyped";
    type DamageKind = "healing" | "damage";
    type MaterialDamageEffect =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "siccatite"
        | "silver"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass";

    interface DamageDamageContext extends BaseRollContext {
        type: "damage-roll";
        sourceType: "attack" | "check" | "save";
        outcome?: DegreeOfSuccessString | null;
        self?: RollOrigin | null;
        target?: RollTarget | null;
        options: Set<string>;
        secret?: boolean;
        /** The domains this roll had, for reporting purposes */
        domains: string[];
        /** The number of MAP increases from the preceding check */
        mapIncreases?: ZeroToTwo;
    }

    interface DamagePartialTerm {
        /** The static amount of damage of the current damage type and category. */
        modifier: number;
        /** Maps the die face ("d4", "d6", "d8", "d10", "d12") to the number of dice of that type. */
        dice: { number: number; faces: DamageDiceFaces } | null;
    }

    interface AbstractDamageRollData extends RollOptions {
        evaluatePersistent?: boolean;
    }

    interface BaseDamageData {
        terms?: DamagePartialTerm[];
        damageType: DamageType;
        diceNumber?: number;
        dieSize?: DamageDieSize | null;
        modifier?: number;
        category: DamageCategoryUnique | null;
        materials?: MaterialDamageEffect[];
    }

    interface WeaponBaseDamageData extends BaseDamageData {
        terms?: never;
    }

    interface DamageFormulaData {
        base: BaseDamageData[];
        dice: DamageDicePF2e[];
        modifiers: ModifierPF2e[];
        /** Maximum number of die increases. Weapons should be set to 1 */
        maxIncreases?: number;
        ignoredResistances: { type: ResistanceType; max: number | null }[];
        kinds?: Set<DamageKind>;
    }

    interface GroupingData<TRollTermData extends RollTermData = RollTermData> extends RollTermData {
        class?: "Grouping";
        term: TRollTermData;
    }

    interface ArithmeticExpressionData extends RollTermData {
        class?: "ArithmeticExpression";
        operator: ArithmeticOperator;
        operands: [RollTermData, RollTermData];
    }

    type ArithmeticOperator = "+" | "-" | "*" | "/" | "%";

    interface BaseDamageTemplate {
        name: string;
        materials: MaterialDamageEffect[];
        modifiers?: (ModifierPF2e | DamageDicePF2e)[];
    }

    interface ResolvedDamageFormulaData extends DamageFormulaData {
        roll?: never;
        formula: Record<DegreeOfSuccessString, string | null>;
        breakdown: Record<DegreeOfSuccessString, string[]>;
    }

    interface WeaponDamageTemplate extends BaseDamageTemplate {
        damage: ResolvedDamageFormulaData;
    }

    interface SpellDamageTemplate extends BaseDamageTemplate {
        damage: {
            roll: DamageRoll;
            breakdown: string[];
        };
    }

    type AfflictionDamageTemplate = SpellDamageTemplate;
    type SimpleDamageTemplate = SpellDamageTemplate;

    type DamageTemplate =
        | WeaponDamageTemplate
        | SpellDamageTemplate
        | AfflictionDamageTemplate
        | SimpleDamageTemplate;

    interface DamageRollData extends RollDataPF2e, AbstractDamageRollData {
        /** Whether to double dice or total on critical hits */
        critRule?: Maybe<CriticalDoublingRule>;
        /** Data used to construct the damage formula and options */
        damage?: DamageTemplate;
        result?: DamageRollFlag;
        degreeOfSuccess?: DegreeOfSuccessIndex | null;
        /** If the total was increased to 1, the original total */
        increasedFrom?: number;
        /** Whether this roll is the splash damage from another roll */
        splashOnly?: boolean;
        /** Resistance types to be ignored */
        ignoredResistances?: { type: ResistanceType; max: number | null }[];
    }

    type CriticalDoublingRule = "double-damage" | "double-dice";

    class InstancePool extends foundry.dice.terms.PoolTerm {}

    class DamageAlteration {}

    abstract class AbstractDamageRoll extends Roll {}

    class DamageInstance extends AbstractDamageRoll {
        kinds: Set<"damage" | "healing">;
        type: DamageType;
        persistent: boolean;
        materials: Set<MaterialDamageEffect>;
        critRule: CriticalDoublingRule | null;

        get head(): RollTerm;
        get category(): DamageCategory | null;
        get typeLabel(): string;
        get critImmuneTotal(): this["total"];
    }

    interface IntermediateDieData extends RollTermData {
        class?: string;
        number: number | NumericTermData | FunctionTermData | GroupingData;
        faces: number | NumericTermData | FunctionTermData | GroupingData;
        die?: DieData | null;
    }

    interface Grouping extends foundry.dice.terms.RollTerm<GroupingData> {}

    interface IntermediateDie extends foundry.dice.terms.RollTerm<IntermediateDieData> {
        number: number | foundry.dice.terms.FunctionTerm | Grouping;
        faces: number | foundry.dice.terms.FunctionTerm | Grouping;
        die: foundry.dice.terms.Die | null;
    }

    class DamageRoll extends AbstractDamageRoll {
        get pool(): InstancePool | null;
        get instances(): DamageInstance[];
        get kinds(): Set<"damage" | "healing">;
        get materials(): Set<MaterialDamageEffect>;
        get minimumValue(): number;
        get expectedValue(): number;
        get maximumValue(): number;
    }

    interface DamageRoll extends AbstractDamageRoll {
        constructor: typeof DamageRoll;

        options: DamageRollData & { showBreakdown: boolean };
    }
}
