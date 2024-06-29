export {};

declare global {
    type ActorFlagsPF2e = foundry.documents.ActorFlags & {
        pf2e: {
            rollOptions: RollOptionFlags;
            /** IDs of granted items that are tracked */
            trackedItems: Record<string, string>;
            [key: string]: unknown;
        };
    };

    interface TokenEffect extends TemporaryEffect {}

    type ActionType = "action" | "free" | "reaction" | "passive";
    // type ActionCost = 0 | 1 | 2 | 3 | "reaction" | "free";
    type ActionCost = {
        type: Exclude<ActionType, "passive">;
        value: OneToThree | null;
    };

    type ActionSection = "skill" | "basic" | "specialty-basic";

    interface ActionMessageOptions {
        blind: boolean;
        variant: string;
        whisper: string[];
    }

    type DCSlug = "ac" | "armor" | "perception" | SaveType | SkillSlug;

    interface ActionVariantUseOptions extends Record<string, unknown> {
        actors: ActorPF2e | ActorPF2e[];
        event: Event;
        traits: ActionTrait[];
        target: ActorPF2e | TokenPF2e;
    }

    interface ActionVariant {
        cost?: ActionCost;
        description?: string;
        glyph?: string;
        name?: string;
        slug: string;
        traits: ActionTrait[];
        toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessagePF2e | undefined>;
        use(options?: Partial<ActionVariantUseOptions>): Promise<unknown>;
    }

    interface ActionUseOptions extends ActionVariantUseOptions {
        variant: string;
    }

    interface Action {
        cost?: ActionCost;
        description?: string;
        glyph?: string;
        img?: string;
        name: string;
        sampleTasks?: Partial<Record<ProficiencyRank, string>>;
        section?: ActionSection;
        slug: string;
        traits: ActionTrait[];
        variants: Collection<ActionVariant>;
        toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessagePF2e | undefined>;
        /** Uses the default variant for this action, which will usually be the first one in the collection. */
        use(options?: Partial<ActionUseOptions>): Promise<unknown>;
    }

    interface RollOptionFlags {
        all: Record<string, boolean | undefined>;
        [key: string]: Record<string, boolean | undefined> | undefined;
    }

    interface ActorHitPointsSource extends ValueAndMaybeMax {
        temp?: number;
    }

    interface ActorAttributesSource {
        hp?: ActorHitPointsSource;
        immunities?: ImmunitySource[];
        weaknesses?: WeaknessSource[];
        resistances?: ResistanceSource[];
    }

    interface WeaknessSource extends IWRSource<WeaknessType> {
        value: number;
    }

    type IWRException<TType extends IWRType = IWRType> =
        | TType
        | { definition: Predicate; label: string };

    interface ResistanceSource extends IWRSource<ResistanceType> {
        value: number;
        doubleVs?: IWRException<ResistanceType>[];
    }

    interface IWRSource<TType extends IWRType = IWRType> {
        type: TType;
        exceptions?: IWRException<TType>[];
    }

    type ImmunityType = string;
    type WeaknessType = string;
    type ResistanceType = string;
    /** Damage types a creature or hazard is possibly unaffected by, outside the IWR framework */
    type UnaffectedType =
        | "bleed"
        | "spirit"
        | "vitality"
        | "void"
        | "good"
        | "evil"
        | "lawful"
        | "chaotic";
    type IWRType = ImmunityType | WeaknessType | ResistanceType;

    type ImmunitySource = IWRSource<ImmunityType>;

    interface ActorTraitsSource<TTrait extends string> {
        /** Actual Pathfinder traits */
        value: TTrait[];
        /** The rarity of the actor */
        rarity?: Rarity;
        /** The actor's size category */
        size?: { value: Size };
    }

    type ActorSystemSource = {
        details?: ActorDetailsSource;
        attributes: ActorAttributesSource;
        traits?: ActorTraitsSource<string>;

        /** Legacy location of `MigrationRecord` */
        schema?: Readonly<{ version: number | null; lastMigration: object | null }>;
    };

    interface AbilityData {
        /** The modifier for this ability */
        mod: number;
        /** A label like "Strength", "Dexterity", etc. */
        label: string;
        /** A label like "Str", "Dex", etc. */
        shortLabel: string;
    }

    /** Basic hitpoints data fields */
    interface BaseHitPointsSource {
        /** The current amount of hitpoints the character has. */
        value: number;
        /** The maximum number of hitpoints this character has. */
        max?: number;
        /** If defined, the amount of temporary hitpoints this character has. */
        temp: number;
        /** Any details about hit points. */
        details: string;
    }

    interface ActorHitPoints extends Required<BaseHitPointsSource> {
        unrecoverable: number;
        negativeHealing: boolean;
    }

    interface ActorDetails extends ActorDetailsSource {
        level: { value: number };
        alliance: ActorAlliance;
    }

    interface TraitViewData {
        /** The name of this action. */
        name: string;
        /** The label for this action which will be rendered on the UI. */
        label: string;
        /** The roll this trait applies to, if relevant. */
        rollName?: string;
        /** The option that this trait applies to the roll (of type `rollName`). */
        rollOption?: string;
        /** An extra css class added to the UI marker for this trait. */
        cssClass?: string;
        /** The description of the trait */
        description: string | null;
    }

    interface StrikeData extends StatisticModifier {
        quantity?: number;
        slug: string;
        label: string;
        /** The type of action; currently just 'strike'. */
        type: "strike";
        /** The glyph for this strike (how many actions it takes, reaction, etc). */
        glyph: string;
        /** A description of this strike. */
        description: string;
        /** A description of what happens on a critical success. */
        criticalSuccess: string;
        /** A description of what happens on a success. */
        success: string;
        /** Action traits associated with this strike */
        traits: TraitViewData[];
        /** Any options always applied to this strike */
        options: string[];
        /**
         * Whether the strike and its auxiliary actions are available (usually when the weapon corresponding with the
         * strike is equipped)
         */
        ready: boolean;
        /** Whether striking itself, independent of the auxiliary actions, is possible */
        canStrike: boolean;
        /** Alias for `attack`. */
        roll?: RollFunction<AttackRollParams>;
        /** Roll to attack with the given strike (with no MAP; see `variants` for MAPs.) */
        attack?: RollFunction<AttackRollParams>;
        /** Roll normal (non-critical) damage for this weapon. */
        damage?: DamageRollFunction;
        /** Roll critical damage for this weapon. */
        critical?: DamageRollFunction;
        /** Alternative usages of a strike weapon: thrown, combination-melee, etc. */
        altUsages?: StrikeData[];
        /** A list of attack variants which apply the Multiple Attack Penalty. */
        variants: { label: string; roll: RollFunction<AttackRollParams> }[];

        /** Ammunition choices and selected ammo if this is a ammo consuming weapon. */
        ammunition?: {
            compatible: { id: string; label: string }[];
            incompatible: { id: string; label: string }[];
            selected: {
                id: string;
                compatible: boolean;
            } | null;
        };

        /** The weapon or melee item--possibly ephemeral--being used for the strike */
        item: WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e>;
    }

    type DamageRollFunction = (
        params?: DamageRollParams
    ) => Promise<string | Rolled<DamageRoll> | null>;

    type RollFunction<T extends RollParameters = RollParameters> = (
        params: T
    ) => Promise<Rolled<CheckRoll> | null | string | void>;

    interface ActorTraitsData<TTrait extends string> extends ActorTraitsSource<TTrait> {
        size?: ActorSizePF2e;
    }

    class ActorSizePF2e {
        /** The size category of this category */
        value: Size;
        /** The length dimension of this actor's space */
        length: number;
        /** The width dimension of this actor's space */
        width: number;
    }

    interface ActorSystemData extends ActorSystemSource {
        abilities?: Abilities;
        details: ActorDetails;
        actions?: StrikeData[];
        attributes: ActorAttributes;
        traits?: ActorTraitsData<string>;

        /** Initiative, used to determine turn order in encounters */
        initiative?: InitiativeTraceData;

        /** An audit log of automatic, non-modifier changes applied to various actor data nodes */
        autoChanges: Record<string, AutoChangeEntry[] | undefined>;
    }

    type SkillSlug =
        | "acrobatics"
        | "arcana"
        | "athletics"
        | "crafting"
        | "deception"
        | "diplomacy"
        | "intimidation"
        | "medicine"
        | "nature"
        | "occultism"
        | "performance"
        | "religion"
        | "society"
        | "stealth"
        | "survival"
        | "thievery";

    interface InitiativeData extends StatisticTraceData {
        statistic: SkillSlug | "perception";
        /**
         * If a pair of initiative rolls are tied, the next resolution step is the tiebreak priority. A lower value
         * constitutes a higher priority.
         */
        tiebreakPriority: ZeroToTwo;
    }

    type PrototypeTokenSourcePF2e = foundry.data.PrototypeTokenSource & {
        flags: {
            pf2e?: {
                linkToActorSize?: boolean;
                autoscale?: boolean;
            };
        };
    };

    type HitPointsStatistic = StatisticModifier & ActorHitPoints;

    interface PrototypeTokenPF2e<TParent extends ActorPF2e | null>
        extends foundry.data.PrototypeToken<TParent> {
        flags: DocumentFlags & {
            pf2e: {
                linkToActorSize: boolean;
                autoscale: boolean;
            };
        };
    }

    type BaseActorSourcePF2e<
        TType extends ActorType,
        TSystemSource extends ActorSystemSource = ActorSystemSource
    > = foundry.documents.ActorSource<TType, TSystemSource, ItemSourcePF2e> & {
        flags: DeepPartial<ActorFlagsPF2e>;
        prototypeToken: PrototypeTokenSourcePF2e;
    };

    type SaveType = "fortitude" | "reflex" | "will";

    interface AttributeBasedTraceData extends StatisticTraceData {
        attribute: AttributeString;
        /** The actual modifier for this martial type */
        value: number;
        /** Describes how the value was computed */
        breakdown: string;
    }

    type InitiativeTraceData = StatisticTraceData & InitiativeData;

    type AttributeString = "str" | "dex" | "con" | "int" | "wis" | "cha";

    interface ActorAttributes extends ActorAttributesSource {
        hp?: ActorHitPoints;
        ac?: { value: number };
        immunities: Immunity[];
        weaknesses: Weakness[];
        resistances: Resistance[];
        shield?: {
            raised: boolean;
            broken: boolean;
        };
        flanking: {
            /** Whether the actor can flank at all */
            canFlank: boolean;
            /** Given the actor can flank, the conditions under which it can do so without an ally opposite the target */
            canGangUp: GangUpCircumstance[];
            /** Whether the actor can be flanked at all */
            flankable: boolean;
            /** Given the actor is flankable, whether it is off-guard when flanked */
            offGuardable: OffGuardableCircumstance;
        };
    }

    type OffGuardableCircumstance =
        /** Flat-footable in all flanking situations */
        | true
        /** Flat-footable if the flanker's level is less than or equal to the actor's own */
        | number
        /** Never off-guardable */
        | false;

    type GangUpCircumstance =
        /** Requires at least `number` allies within melee reach of the target */
        | number
        /** Requires the actor's animal companion to be adjacent to the target */
        | "animal-companion"
        /** Requires the actor's eidolon to be adjacent to the target */
        | "eidolon"
        /** The Gang Up rogue feat allows allies to flank with the gang-upper */
        | true;

    interface ActorDetailsSource {
        /** The level of this actor */
        level?: { value: number };
        /** The alliance this NPC belongs to: relevant to mechanics like flanking */
        alliance?: ActorAlliance;
    }

    type ActorAlliance = "party" | "opposition" | null;

    type MovementType = "land" | "burrow" | "climb" | "fly" | "swim";
}
