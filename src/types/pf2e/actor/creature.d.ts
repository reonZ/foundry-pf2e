export {};

declare global {
    type CreatureActorType = "character" | "npc" | "familiar";

    type BaseCreatureSource<
        TType extends CreatureActorType,
        TSystemSource extends CreatureSystemSource
    > = BaseActorSourcePF2e<TType, TSystemSource>;

    /** Skill and Lore statistics for rolling. */

    interface CreatureSystemSource extends ActorSystemSource {
        attributes: CreatureAttributesSource;

        details?: CreatureDetailsSource;

        /** Traits, languages, and other information. */
        traits?: CreatureTraitsSource;

        /** Maps roll types -> a list of modifiers which should affect that roll type. */
        customModifiers?: Record<string, RawModifier[]>;

        /** Saving throw data */
        saves?: Record<SaveType, object | undefined>;

        resources?: CreatureResourcesSource;
    }

    interface CreatureAttributesSource extends ActorAttributesSource {
        hp: CreatureHitPointsSource;
    }

    interface CreatureHitPointsSource extends ActorHitPointsSource {
        temp: number;
    }

    interface CreatureDetailsSource extends ActorDetailsSource {
        /** Languages this creature knows and (probably) can speak */
        languages?: CreatureLanguagesData;
    }

    interface CreatureLanguagesData {
        value: Language[];
        details: string;
    }

    type Language = string | "common";

    type CreatureTrait = string;

    interface CreatureTraitsSource extends ActorTraitsSource<CreatureTrait> {}

    interface CreatureResourcesSource {
        focus?: {
            value: number;
            max?: number;
        };
    }

    interface CreatureSystemData extends Omit<CreatureSystemSource, "attributes">, ActorSystemData {
        abilities?: Abilities;

        details: CreatureDetails;

        /** Traits, languages, and other information. */
        traits: CreatureTraitsData;

        attributes: CreatureAttributes;

        /** The perception statistic */
        perception: CreaturePerceptionData;

        /** Maps roll types -> a list of modifiers which should affect that roll type. */
        customModifiers: Record<string, ModifierPF2e[]>;
        /** Maps damage roll types -> a list of damage dice which should be added to that damage roll type. */
        damageDice: Record<string, DamageDicePF2e[]>;

        /** Saving throw data */
        saves: CreatureSaves;

        skills: Record<SkillSlug, SkillData>;

        actions?: StrikeData[];
        resources?: CreatureResources;
    }

    type ModeOfBeing = "living" | "undead" | "construct" | "object";

    type SenseAcuity = "precise" | "imprecise" | "vague";
    type SenseType =
        | "darkvision"
        | "echolocation"
        | "greater-darkvision"
        | "infrared-vision"
        | "lifesense"
        | "low-light-vision"
        | "motion-sense"
        | "scent"
        | "see-invisibility"
        | "spiritsense"
        | "thoughtsense"
        | "tremorsense"
        | "truesight"
        | "wavesense";

    type SpecialVisionType = Extract<
        SenseType,
        "low-light-vision" | "darkvision" | "greater-darkvision" | "see-invisibility"
    >;

    type SenseData =
        | { type: SpecialVisionType; acuity?: "precise"; range?: number; source?: Maybe<string> }
        | { type: SenseType; acuity: SenseAcuity; range: number; source?: Maybe<string> };

    interface CreaturePerceptionData extends PerceptionTraceData {
        attribute: AttributeString;
    }

    /** Data describing the value & modifier for a base ability score. */
    interface AbilityData {
        /** The modifier for this ability */
        mod: number;
        /** A label like "Strength", "Dexterity", etc. */
        label: string;
        /** A label like "Str", "Dex", etc. */
        shortLabel: string;
    }

    type Abilities = Record<AttributeString, AbilityData>;

    interface CreatureTraitsData extends Required<CreatureTraitsSource> {
        size: ActorSizePF2e;
        /** Temporary variable that holds pre-equipment resize data */
        naturalSize?: Size;
    }
    interface CreatureDetails extends Required<CreatureDetailsSource> {}

    type SkillData = AttributeBasedTraceData;

    /** The full save data for a character; including its modifiers and other details */
    interface SaveData extends AttributeBasedTraceData {
        saveDetail?: string;
    }

    type CreatureSaves = Record<SaveType, SaveData>;

    /** Miscallenous but mechanically relevant creature attributes.  */
    interface CreatureAttributes extends ActorAttributes {
        hp: ActorHitPoints;
        ac: CreatureACData;
        hardness: { value: number };

        /** The creature's natural reach */
        reach: {
            /** The default reach for all actions requiring one */
            base: number;
            /** Its reach for the purpose of manipulate actions, usually the same as its base reach */
            manipulate: number;
        };

        shield?: HeldShieldData;
        speed: CreatureSpeeds;

        /** The current dying level (and maximum) for this creature. */
        dying: ValueAndMax & { recoveryDC: number };
        /** The current wounded level (and maximum) for this creature. */
        wounded: ValueAndMax;
        /** The current doomed level (and maximum) for this creature. */
        doomed: ValueAndMax;

        /** Whether this creature emits sound */
        emitsSound: boolean;
    }

    interface CreatureACData extends ArmorClassTraceData {
        attribute: AttributeString;
    }

    interface CreatureSpeeds extends StatisticModifier {
        type: "land";
        /** The actor's primary speed (usually walking/stride speed). */
        value: number;
        /** Other speeds that this actor can use (such as swim, climb, etc). */
        otherSpeeds: LabeledSpeed[];
        /** The derived value after applying modifiers, bonuses, and penalties */
        total: number;
    }

    interface LabeledSpeed extends Omit<LabeledNumber, "exceptions"> {
        type: Exclude<MovementType, "land">;
        source?: string;
        total?: number;
        derivedFromLand?: boolean;
    }

    /** Creature initiative statistic */
    interface CreatureInitiativeSource {
        /** What skill or ability is currently being used to compute initiative. */
        statistic: SkillSlug | "perception";
    }

    interface CreatureResources extends CreatureResourcesSource {
        /** The current number of focus points and pool size */
        focus: {
            value: number;
            max: number;
            cap: number;
        };
    }

    interface CreatureResourceData extends LabeledValueAndMax {
        slug: string;
    }

    enum VisionLevels {
        BLINDED,
        NORMAL,
        LOWLIGHT,
        DARKVISION,
    }

    type VisionLevel = ZeroToThree;

    /** A PC's or NPC's held shield. An NPC's values can be stored directly on the actor or come from a shield item. */
    interface HeldShieldData {
        /** The item ID of the shield if in use or otherwise `null` */
        itemId: string | null;
        /** The name of the shield (defaulting to "Shield" if not from a shield item) */
        name: string;
        /** The shield's AC */
        ac: number;
        /** The shield's hardness */
        hardness: number;
        /** The shield's broken threshold */
        brokenThreshold: number;
        /** The shield's hit points */
        hp: ValueAndMax;
        /** Whether the shield is raised */
        raised: boolean;
        /** Whether the shield is broken */
        broken: boolean;
        /** Whether the shield is destroyed (hp.value === 0) */
        destroyed: boolean;
        /** An effect icon to use when the shield is raised */
        icon: ImageFilePath;
    }

    type CreatureSource = CharacterSource | NPCSource | FamiliarSource;

    interface CreatureUpdateOperation<TParent extends TokenDocumentPF2e | null>
        extends ActorUpdateOperation<TParent> {
        allowHPOverage?: boolean;
    }

    type SenseSchema = {
        type: foundry.data.fields.StringField<SenseType, SenseType, true, false, false>;
        acuity: foundry.data.fields.StringField<SenseAcuity, SenseAcuity, true, false, true>;
        range: foundry.data.fields.NumberField<number, number, true, true, true>;
        source: foundry.data.fields.StringField<string, string, false, true, true>;
    };

    interface GetReachParameters {
        action?: "interact" | "attack";
        weapon?: Maybe<AbilityItemPF2e<ActorPF2e> | WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e>>;
    }

    interface ChangeCarryTypeOptions {
        /** Whether the item is held, worn, stowed, etc. */
        carryType: ItemCarryType;
        /** If requesting to hold the item, how many holds with which to holt it */
        handsHeld?: ZeroToTwo;
        /** If requesting to wear the item, and the item has a usage slot, whether the item to be in the slot */
        inSlot?: boolean;
    }

    type CreatureType =
        | "undead"
        | "construct"
        | "plant"
        | "spirit"
        | "vitality"
        | "void"
        | "time"
        | "fungus"
        | "shadow"
        | "beast"
        | "dream"
        | "fey"
        | "aberration"
        | "animal"
        | "astral"
        | "celestial"
        | "dragon"
        | "elemental"
        | "ethereal"
        | "fiend"
        | "giant"
        | "humanoid"
        | "monitor"
        | "ooze"
        | "petitioner";

    class Sense extends foundry.abstract.DataModel<ActorPF2e, SenseSchema> {
        get label(): string | null;
    }

    abstract class CreaturePF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends ActorPF2e<TParent> {
        /** A separate collection of owned spellcasting entries for convenience */
        declare spellcasting: ActorSpellcasting<this>;
        declare parties: Set<PartyPF2e>;
        /** A creature always has an AC */
        declare armorClass: StatisticDifficultyClass<ArmorStatistic>;
        /** Skill checks for the creature, built during data prep */
        declare skills: Record<string, Statistic<this>>;
        /** Saving throw rolls for the creature, built during data prep */
        declare saves: Record<SaveType, Statistic>;

        declare perception: PerceptionStatistic;

        get traits(): Set<CreatureTrait>;
        get hitPoints(): HitPointsSummary;
        get creatureTypes(): CreatureType[];
        get rarity(): Rarity;
        get hasDarkvision(): boolean;
        get hasLowLightVision(): boolean;
        get isSpellcaster(): boolean;
        get wornArmor(): ArmorPF2e<this> | null;

        getReach(options?: GetReachParameters): number;

        changeCarryType(
            item: PhysicalItemPF2e<CreaturePF2e>,
            options?: ChangeCarryTypeOptions
        ): Promise<void>;

        /**
         * Updates a resource. Redirects to special resources if needed.
         * Accepts resource slugs in both kebab and dromedary, to handle token updates and direct ones.
         */
        updateResource(resource: string, value: number): Promise<void>;
    }

    interface CreaturePF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends ActorPF2e<TParent> {
        readonly _source: CreatureSource;
        system: CreatureSystemData;

        /** Extend `DatabaseUpdateOperation` for creatures */
        update(
            data: Record<string, unknown>,
            operation?: Partial<CreatureUpdateOperation<TParent>>
        ): Promise<this | undefined>;

        /** See implementation in class */
        updateEmbeddedDocuments(
            embeddedName: "ActiveEffect",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<DatabaseUpdateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[]>;
        updateEmbeddedDocuments(
            embeddedName: "Item",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<DatabaseUpdateOperation<this>>
        ): Promise<ItemPF2e<this>[]>;
        updateEmbeddedDocuments(
            embeddedName: "ActiveEffect" | "Item",
            updateData: EmbeddedDocumentUpdateData[],
            operation?: Partial<DatabaseUpdateOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[] | ItemPF2e<this>[]>;

        deleteEmbeddedDocuments(
            embeddedName: "ActiveEffect",
            ids: string[],
            operation?: Partial<DatabaseDeleteOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[]>;
        deleteEmbeddedDocuments(
            embeddedName: "Item",
            ids: string[],
            operation?: Partial<DatabaseDeleteOperation<this>>
        ): Promise<ItemPF2e<this>[]>;
        deleteEmbeddedDocuments(
            embeddedName: "ActiveEffect" | "Item",
            ids: string[],
            operation?: Partial<DatabaseDeleteOperation<this>>
        ): Promise<ActiveEffectPF2e<this>[] | ItemPF2e<this>[]>;
    }
}
