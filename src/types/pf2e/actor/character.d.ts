export {};

declare global {
    type CharacterSource = BaseCreatureSource<"character", CharacterSystemSource> & {
        flags: DeepPartial<CharacterFlags>;
    };

    type CharacterFlags = ActorFlagsPF2e & {
        pf2e: {
            /** If applicable, the character's proficiency rank in their deity's favored weapon */
            favoredWeaponRank: number;
            /** The highest number of damage dice among the character's equipped weapons and available unarmed attacks */
            highestWeaponDamageDice: number;
            /** Whether items are crafted without consuming resources */
            freeCrafting: boolean;
            /** Whether the alchemist's (and related dedications) Quick Alchemy ability is enabled */
            quickAlchemy: boolean;
            /** Whether ABP should be disabled despite it being on for the world */
            disableABP?: boolean;
            /** Which sheet tabs are displayed */
            sheetTabs: CharacterSheetTabVisibility;
            /** Whether the basic unarmed attack is shown on the Actions tab */
            showBasicUnarmed: boolean;
            /** The limit for each feat group that supports a custom limit. */
            featLimits: Record<string, number>;
        };
    };

    interface CraftingFormulaData {
        uuid: ItemUUID;
        sort?: number;
        dc?: number;
        batchSize?: number;
        deletable?: boolean;
    }

    interface AuxiliaryInteractParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "interact";
        annotation: "draw" | "grip" | "modular" | "pick-up" | "retrieve" | "sheathe";
        hands?: ZeroToTwo;
    }

    interface AuxiliaryShieldParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "end-cover" | "raise-a-shield" | "take-cover";
        annotation?: "tower-shield";
        hands?: never;
    }

    interface AuxiliaryReleaseParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "release";
        annotation: "grip" | "drop";
        hands: 0 | 1;
    }

    type AuxiliaryActionParams =
        | AuxiliaryInteractParams
        | AuxiliaryShieldParams
        | AuxiliaryReleaseParams;
    type AuxiliaryActionType = AuxiliaryActionParams["action"];
    type AuxiliaryActionPurpose = AuxiliaryActionParams["annotation"];

    interface CharacterSystemSource extends CreatureSystemSource {
        abilities: Record<AttributeString, { mod: number }> | null;
        attributes: CharacterAttributesSource;
        details: CharacterDetailsSource;
        build?: CharacterBuildSource;
        proficiencies?: {
            attacks?: Record<string, MartialProficiencySource | undefined>;
        };
        skills: Partial<Record<SkillSlug, { rank: ZeroToFour }>>;
        resources: CharacterResourcesSource;
        initiative: CreatureInitiativeSource;
        crafting?: { formulas: CraftingFormulaData[] };

        /** Pathfinder Society Organized Play */
        pfs: PathfinderSocietyData;

        perception?: never;
        saves?: never;
        traits?: never;
    }

    interface MartialProficiencySource {
        rank: ZeroToFour;
        custom?: boolean;
    }

    interface CharacterAttributesSource extends ActorAttributesSource {
        hp: {
            value: number;
            temp: number;
            /** Stamina points: present if Stamina variant is enabled  */
            sp?: { value: number };
        };
        speed: {
            value: number;
            otherSpeeds: {
                type: Exclude<MovementType, "land">;
                value: number;
            }[];
        };
    }

    interface CharacterDetailsSource extends CreatureDetailsSource {
        level: { value: number };
        languages: CreatureLanguagesData;
        /** The key ability which class saves (and other class-related things) scale off of. */
        keyability: { value: AttributeString };

        /** How old the character is */
        age: { value: string };
        /** Character height */
        height: { value: string };
        /** Character weight */
        weight: { value: string };
        /** Character gender/pronouns */
        gender: { value: string };
        /** Character ethnicity */
        ethnicity: { value: string };
        nationality: { value: string };
        /** User-provided biography for their character */
        biography: CharacterBiography;

        /** The amount of experience this character has. */
        xp: {
            /** The current experience value.  */
            value: number;
            /** The minimum amount of experience (almost always '0'). */
            min: number;
            /** The maximum amount of experience before level up (usually '1000', but may differ.) */
            max: number;
            /** COMPUTED: The percentage completion of the current level (value / max). */
            pct: number;
        };
    }

    interface CharacterBiography {
        /** HTML value */
        appearance: string;
        /** HTML value */
        backstory: string;
        birthPlace: string;
        attitude: string;
        beliefs: string;
        edicts: string[];
        anathema: string[];
        likes: string;
        dislikes: string;
        catchphrases: string;
        /** HTML value */
        campaignNotes: string;
        /** HTML value */
        allies: string;
        /** HTML value */
        enemies: string;
        /** HTML value */
        organizations: string;
        /** Visibility (to users with limited ownership of the PC) toggle states */
        visibility: {
            appearance: boolean;
            backstory: boolean;
            personality: boolean;
            campaign: boolean;
        };
    }

    interface CharacterBuildSource {
        attributes?: AttributeBoostsSource;
    }

    interface AttributeBoostsSource {
        /** Whether this PC's ability scores are being manually entered (aka custom) */
        manual: boolean;

        boosts: {
            1?: AttributeString[];
            5?: AttributeString[];
            10?: AttributeString[];
            15?: AttributeString[];
            20?: AttributeString[];
        };

        /** Attribute Apex increase from Automatic Bonus Progression */
        apex?: AttributeString | null;
    }

    interface CharacterResourcesSource {
        heroPoints: ValueAndMax;
        focus?: { value: number; max?: never };
        crafting?: { infusedReagents?: { value: number } };
        /** Used in the variant stamina rules; a resource expended to regain stamina/hp. */
        resolve?: { value: number };
    }

    /** A Pathfinder Society Faction */
    type PFSFaction = "EA" | "GA" | "HH" | "VS" | "RO" | "VW";

    /** A Pathfinder Society School */
    type PFSSchool = "scrolls" | "spells" | "swords" | null;

    /** PFS faction reputation values */
    type PathfinderSocietyReputation = Record<PFSFaction, number | null>;

    /** Pathfinder Society Organized Play data fields */
    interface PathfinderSocietyData {
        /** Number assigned to the player. */
        playerNumber: number | null;
        /** Number assigned to the character. */
        characterNumber: number | null;
        /** Is the character currently affected by a level bump? */
        levelBump: boolean;
        /** Character's currently slotted faction */
        currentFaction: PFSFaction;

        /** Character's Pathfinder school */
        school: PFSSchool;

        /** Character's Reputation with all the factions */
        reputation: PathfinderSocietyReputation;
    }

    /** The raw information contained within the actor data object for characters. */
    interface CharacterSystemData
        extends Omit<
                CharacterSystemSource,
                "customModifiers" | "perception" | "resources" | "saves" | "traits"
            >,
            CreatureSystemData {
        /** The six primary attribute scores. */
        abilities: CharacterAbilities;

        /** Character build data, currently containing attribute boosts and flaws */
        build: CharacterBuildData;

        /** The three save types. */
        saves: CharacterSaves;

        /** Various details about the character, such as level, experience, etc. */
        details: CharacterDetails;

        attributes: CharacterAttributes;

        perception: CharacterPerceptionData;

        initiative: InitiativeData;

        /** A catch-all for character proficiencies */
        proficiencies: {
            /** Proficiencies in the four weapon categories as well as groups, base weapon types, etc. */
            attacks: Record<WeaponCategory, MartialProficiency> &
                Record<string, MartialProficiency | undefined>;
            /** Proficiencies in the four armor categories as well as groups, base armor types, etc. */
            defenses: Record<ArmorCategory, MartialProficiency> &
                Record<string, MartialProficiency | undefined>;
            /** Zero or more class DCs, used for saves related to class abilities. */
            classDCs: Record<string, ClassDCData>;
            /** Spellcasting attack modifier and dc for all spellcasting */
            spellcasting: CharacterProficiency;
            /** Aliased path components for use by rule element during property injection */
            aliases?: Record<string, string | undefined>;
        };

        /** Player skills, used for various skill checks. */
        skills: Record<SkillSlug, CharacterSkillData>;

        /** Special strikes which the character can take. */
        actions: CharacterStrike[];

        resources: CharacterResources;

        /** Crafting-related data, including known formulas */
        crafting: CharacterCraftingData;

        exploration: string[];
    }

    interface CharacterSkillData extends SkillData {
        attribute: AttributeString;
        /** The proficiency rank ("TEML") */
        rank: ZeroToFour;
        /** Whether this skill is subject to an armor check penalty */
        armor: boolean;
        /** Is this skill a Lore skill? */
        lore?: boolean;
        /** If this is a lore skill, what item it came from */
        itemID: string | null;
    }

    interface CharacterAbilityData extends AbilityData {
        /** An ability score prior to modification by items */
        base: number;
    }

    interface CharacterBuildData {
        attributes: AttributeBoosts;
        languages: LanguageBuildData;
    }

    interface LanguageBuildData extends ValueAndMax {
        /** Specific languages granted by ancestry, feats, etc., that do not count against the character's maximum */
        granted: GrantedLanguage[];
    }

    /** A language added by some freature (typically ancestry) that doesn't count against the character's maximum */
    interface GrantedLanguage {
        slug: Language;
        source: string;
    }

    /**
     * Prepared system data for character ability scores. This is injected by ABC classes to complete it.
     */
    interface AttributeBoosts extends AttributeBoostsSource {
        /** Key ability score options drawn from class and class features */
        keyOptions: AttributeString[];

        boosts: Required<AttributeBoostsSource["boosts"]> & {
            ancestry: AttributeString[];
            background: AttributeString[];
            class: AttributeString | null;
        };

        /** Number of remaining allowed boosts (UI and gradual ability boosts only) */
        allowedBoosts: {
            1: number;
            5: number;
            10: number;
            15: number;
            20: number;
        };

        flaws: {
            ancestry: AttributeString[];
        };

        apex: AttributeString | null;
    }

    type CharacterAbilities = Record<AttributeString, CharacterAbilityData>;

    interface CharacterSaveData extends SaveData {
        /** The proficiency rank ("TEML") */
        rank: ZeroToFour;
    }
    type CharacterSaves = Record<SaveType, CharacterSaveData>;

    interface CharacterProficiency {
        label?: string;
        /** The actual modifier for this martial type. */
        value: number;
        /** Describes how the value was computed. */
        breakdown: string;
        /** The proficiency rank (0 untrained - 4 legendary). */
        rank: ZeroToFour;
    }

    /** A proficiency with a rank that depends on another proficiency */
    interface MartialProficiency extends CharacterProficiency {
        label: string;
        /** A predicate to match against weapons and unarmed attacks */
        definition?: Predicate;
        /** The category to which this proficiency is linked */
        sameAs?: WeaponCategory | ArmorCategory;
        /** The maximum rank this proficiency can reach */
        maxRank?: Exclude<ProficiencyRank, "untrained">;
        /** Whether the proficiency was manually added by the user */
        custom?: boolean;
    }

    type CategoryProficiencies = Record<ArmorCategory | WeaponCategory, CharacterProficiency>;

    type BaseWeaponProficiencyKey = `weapon-base-${BaseWeaponType}`;

    type WeaponGroupProficiencyKey = `weapon-group-${WeaponGroup}`;

    /** The full data for the class DC; similar to SkillData, but is not rollable. */
    interface ClassDCData extends Required<AttributeBasedTraceData> {
        label: string;
        rank: ZeroToFour;
        primary: boolean;
    }

    class WeaponAuxiliaryAction {
        execute(options?: { selection?: string | null }): Promise<void>;
    }

    /** The full data for a character strike */
    interface CharacterStrike extends StrikeData {
        item: WeaponPF2e<CharacterPF2e>;
        /** Whether this attack is visible on the sheet */
        visible: boolean;
        /** Domains/selectors from which modifiers are drawn */
        domains: string[];
        /** Whether the character has sufficient hands available to wield this weapon or use this unarmed attack */
        handsAvailable: boolean;
        altUsages: CharacterStrike[];
        auxiliaryActions: WeaponAuxiliaryAction[];
        weaponTraits: TraitViewData[];
        doubleBarrel: { selected: boolean } | null;
        versatileOptions: VersatileWeaponOption[];
    }

    interface VersatileWeaponOption {
        value: DamageType;
        selected: boolean;
        label: string;
        glyph: string | null;
    }

    interface CharacterResources extends CreatureResources {
        /** The current and maximum number of hero points */
        heroPoints: ValueAndMax;
        /** The current and maximum number of invested items */
        investiture: ValueAndMax;
        crafting: { infusedReagents: ValueAndMax };
        resolve?: ValueAndMax;
    }

    interface CharacterPerceptionData extends CreaturePerceptionData {
        rank: ZeroToFour;
    }

    interface CharacterDetails extends Omit<CharacterDetailsSource, "alliance">, CreatureDetails {
        /** Convenience information for easy access when the item class instance isn't available */
        ancestry: {
            name: string;
            trait: string;
            /** An "adopted" ancestry (typically gained through the Adopted Ancestry feat) */
            adopted: string | null;
            /** A versatile ancestry trait (such as "orc" for being a half-orc) */
            versatile: string | null;
            /** All ancestries and versatile heritages the character "counts as" when selecting ancestry feats */
            countsAs: string[];
        } | null;
        heritage: { name: string; trait: string | null } | null;
        class: { name: string; trait: string } | null;
        deities: CharacterDeities;
    }

    interface CharacterDeities {
        primary: DeityDetails | null;
        secondary: null;
        domains: { [K in DeityDomain]?: string };
    }

    interface DeityDetails extends Pick<DeitySystemData, "skill"> {
        weapons: BaseWeaponType[];
    }

    interface CharacterAttributes
        extends Omit<CharacterAttributesSource, "immunities" | "weaknesses" | "resistances">,
            CreatureAttributes {
        /** Used for saves related to class abilities */
        classDC: ClassDCData | null;
        /** The best spell DC, used for certain saves related to feats */
        spellDC: { rank: number; value: number } | null;
        /** The higher between highest spellcasting DC and (if present) class DC */
        classOrSpellDC: { rank: number; value: number };
        /** The amount of HP provided per level by the character's class. */
        classhp: number;
        /** The amount of HP provided at level 1 by the character's ancestry. */
        ancestryhp: number;
        /** The number of hands this character has free */
        handsFree: number;

        /** The number of familiar abilities this character's familiar has access to. */
        familiarAbilities: { value: number };

        /** Data related to character hitpoints. */
        hp: CharacterHitPoints;

        speed: CreatureSpeeds;

        /**
         * Data related to the currently equipped shield. This is copied from the shield data itself and exists to
         * allow for the shield health to be shown on an actor shield and token.
         */
        shield: HeldShieldData;

        /** Whether this actor is under a polymorph effect */
        polymorphed: boolean;

        /** Whether this actor is under a battle form polymorph effect */
        battleForm: boolean;
    }

    interface FeatGroupOptions {
        id: string;
        label: string;
        featFilter?: string[];
        supported?: FeatOrFeatureCategory[];
        slots?: (FeatSlotCreationData | string | number)[];
        level?: number;
    }

    interface FeatNotSlot<T extends FeatLike = FeatPF2e> {
        feat: T;
        children: FeatSlot<FeatLike | HeritagePF2e>[];
    }

    interface FeatSlotCreationData extends Omit<FeatSlot, "children" | "feat" | "level"> {
        level?: Maybe<number>;
    }

    interface FeatLike<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        category: string;
        group: FeatGroup<NonNullable<TParent>, this> | null;
        isFeat: boolean;
        isFeature: boolean;
        system: ItemSystemData & {
            location: string | null;
        };
    }

    interface FeatBrowserFilterProps {
        categories?: FeatOrFeatureCategory[];
        traits?: string[];
        omitTraits?: string[];
        conjunction?: "or" | "and";
    }

    class FeatGroup<TActor extends ActorPF2e = ActorPF2e, TItem extends FeatLike = FeatPF2e> {
        actor: TActor;
        id: string;
        label: string;
        feats: (FeatSlot<TItem> | FeatNotSlot<TItem>)[];
        /** Whether the feats are slotted by level or free-form */
        slotted: boolean;
        /** Feat Types that are supported */
        supported: FeatOrFeatureCategory[];
        filter: FeatBrowserFilterProps;
        /** Lookup for the slots themselves */
        slots: Record<string, FeatSlot<TItem> | undefined>;
        /** This groups display's limit. Usually equal to actor level */
        limit: number;
        /** This group's level. If slotted, it is equal to the highest leveled slot. */
        level: number;
    }

    interface FeatSlot<TItem extends FeatLike | HeritagePF2e = FeatPF2e> {
        id: string;
        label?: Maybe<string>;
        level: number | null;
        feat?: Maybe<TItem>;
        children: FeatSlot<FeatLike | HeritagePF2e>[];
    }

    interface CharacterHitPoints extends HitPointsStatistic {
        recoveryMultiplier: number;
        recoveryAddend: number;
        sp?: ValueAndMax;
    }

    /** Data used to describe a feat slot when creating a new feat group */
    interface FeatSlotData {
        /**
         * A globally unique id. In future versions this may become locally unique instead.
         * If omitted, it is <group id>-<level>.
         */
        id?: string;
        /** Short label for the feat slot, displayeed on the left. By default it is the level */
        label?: Maybe<string>;
        /** The level of the feat that should go in this slot */
        level?: Maybe<number>;
        /**
         * The limit value the group needs in order to display this feat.
         * This can be different from level if the group is based on tiers.
         */
        tier?: Maybe<number>;
        /** The text to display when the feat slot is empty */
        placeholder?: Maybe<string>;
        /** If given, these filters will be prioritized over the group's filters */
        filter?: FeatBrowserFilterProps;
    }

    /** Data that defines how a feat group is structured */
    interface FeatGroupData {
        id: string;
        label: string;
        supported?: FeatOrFeatureCategory[];
        filter?: FeatBrowserFilterProps;
        slots?: (FeatSlotData | number)[];
        /** If true, all slots are sorted by their level. Only applies if slotless */
        sorted?: boolean;
        /** If set to true, all slots except the first will be hidden unless its been assigned to */
        requiresInitial?: boolean;
        /** Default placeholder text for empty slots */
        placeholder?: string;
        /** If given, this is feat group has a configurable limit independent of level */
        customLimit?: {
            label: string;
            min: number;
            max: number;
        } | null;
    }

    class CharacterFeats<TActor extends CharacterPF2e> extends Collection<FeatGroup<TActor>> {
        bonus: FeatGroup<TActor>;

        createGroup(data: FeatGroupData): FeatGroup;

        insertFeat(
            feat: FeatPF2e,
            slotData: { groupId: string; slotId: string | null } | null
        ): Promise<ItemPF2e<TActor>[]>;

        assignToSlots(): void;
    }

    interface DexterityModifierCapData {
        /** The numeric value that constitutes the maximum Dexterity modifier. */
        value: number;
        /** The source of this Dex cap - usually the name of an armor, a monk stance, or a spell. */
        source: string;
    }

    type CharacterSkill<TActor extends CharacterPF2e = CharacterPF2e> = Statistic<TActor> & {
        rank: ZeroToFour;
    };

    type CharacterSkills<TActor extends CharacterPF2e = CharacterPF2e> = Record<
        string,
        CharacterSkill<TActor>
    >;

    class CharacterPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends CreaturePF2e<TParent> {
        /** Core singular embeds for PCs */
        declare ancestry: AncestryPF2e<this> | null;
        declare heritage: HeritagePF2e<this> | null;
        declare background: BackgroundPF2e<this> | null;
        declare class: ClassPF2e<this> | null;
        declare deity: DeityPF2e<this> | null;

        /** A cached reference to this PC's familiar */
        declare familiar: FamiliarPF2e | null;

        declare feats: CharacterFeats<this>;
        declare pfsBoons: FeatPF2e<this>[];
        declare deityBoonsCurses: FeatPF2e<this>[];

        /** The primary class DC */
        declare classDC: Statistic | null;
        /** All class DCs, including the primary */
        declare classDCs: Record<string, Statistic>;
        /** Skills for the character, built during data prep */
        declare skills: CharacterSkills<this>;

        declare initiative: ActorInitiative;

        declare crafting: CharacterCrafting;

        get heroPoints(): { value: number; max: number };

        rollRecovery(event?: MouseEvent): Promise<Rolled<CheckRoll> | null>;
        toggleInvested(itemId: string): Promise<boolean>;
        getCraftingEntries(): Promise<CraftingAbility[]>;
        getCraftingEntry(selector: string): Promise<CraftingAbility | null>;
    }

    interface CharacterPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends CreaturePF2e<TParent> {
        flags: CharacterFlags;
        readonly _source: CharacterSource;
        system: CharacterSystemData;

        getResource(
            resource: "hero-points" | "mythic-points" | "focus" | "investiture" | "infused-reagents"
        ): CreatureResourceData;
        getResource(resource: string): CreatureResourceData | null;
    }
}
