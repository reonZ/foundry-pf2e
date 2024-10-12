import { RollNotePF2e } from "../../../pf2e";

export { };

declare global {
    interface BaseStatisticData {
        /** An identifier such as "reflex" or "ac" or "deception" */
        slug: string;
        label: string;
        /** Base domains for fetching actor roll options */
        domains?: string[];
        /** Modifiers not retrieved from the actor's synthetics record */
        modifiers?: ModifierPF2e[];
    }

    interface StatisticData extends BaseStatisticData {
        attribute?: AttributeString | null;
        rank?: ZeroToFour;
        /** If the actor is proficient with this statistic (rather than deriving from rank) */
        proficient?: boolean;
        lore?: boolean;
        check?: StatisticCheckData;
        dc?: StatisticDifficultyClassData;
        /** If given, filters all automatically acquired modifiers */
        filter?: (m: ModifierPF2e) => boolean;
        /**
         * Any static roll options that should be added to the list of roll options.
         * This does not include actor, rank, or basic item roll options.
         */
        rollOptions?: string[];
    }

    interface StatisticCheckData {
        type: CheckType;
        label?: string;
        /** Additional domains for fetching actor roll options */
        domains?: string[];
        /** Modifiers not retrieved from the actor's synthetics record */
        modifiers?: ModifierPF2e[];
    }

    interface StatisticDifficultyClassData {
        /** Additional domains for fetching actor roll options */
        domains?: string[];
        label?: string;
        /** Modifiers not retrieved from the actor's synthetics record */
        modifiers?: ModifierPF2e[];
    }

    interface BaseStatisticTraceData {
        slug: string;
        label: string;
        /** A numeric value of some kind: semantics determined by `AbstractBaseStatistic` subclass */
        value: number;
        breakdown: string;
        modifiers: Required<RawModifier>[];
    }

    interface StatisticTraceData<TAttribute extends AttributeString | null = AttributeString | null>
        extends BaseStatisticTraceData {
        /** Either the totalModifier or the dc depending on what the data is for */
        value: number;
        totalModifier: number;
        dc: number;
        attribute: TAttribute;
    }

    interface CheckDCReference {
        slug: string;
        value?: never;
    }

    interface StatisticRollParameters {
        /** A string of some kind to identify the roll: will be included in `CheckRoll#options` */
        identifier?: string;
        /** The slug of an action of which this check is a constituent roll */
        action?: string;
        /** What token to use for the roll itself. Defaults to the actor's token */
        token?: Maybe<TokenDocumentPF2e>;
        /** Which attack this is (for the purposes of multiple attack penalty) */
        attackNumber?: number;
        /** Optional target for the roll */
        target?: Maybe<ActorPF2e>;
        /** Optional origin for the roll: only one of target and origin may be provided */
        origin?: Maybe<ActorPF2e>;
        /** Optional DC data for the roll */
        dc?: CheckDC | CheckDCReference | number | null;
        /** Optional override for the check modifier label */
        label?: string;
        /** An optional identifying slug to give a specific check: propagated to roll options */
        slug?: Maybe<string>;
        /** Optional override for the dialog's title: defaults to label */
        title?: string;
        /** Any additional roll notes that should be used in the roll. */
        extraRollNotes?: (RollNotePF2e | RollNoteSource)[];
        /** Any additional options that should be used in the roll. */
        extraRollOptions?: string[];
        /** Additional modifiers */
        modifiers?: ModifierPF2e[];
        /** The originating item of this attack, if any */
        item?: ItemPF2e<ActorPF2e> | null;
        /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
        rollMode?: RollMode | "roll";
        /** Should the dialog be skipped */
        skipDialog?: boolean;
        /** Should this roll be rolled twice? If so, should it keep highest or lowest? */
        rollTwice?: RollTwiceOption;
        /** Any traits for the check */
        traits?: (TraitViewData | string)[];
        /** Whether the check is part of a damaging action */
        damaging?: boolean;
        /** Indication that the check is associated with a melee action */
        melee?: boolean;
        /** Whether to create a chat message using the roll (defaults true) */
        createMessage?: boolean;
        /** Callback called when the roll occurs. */
        callback?: CheckRollCallback;
        /** Allow use of events for modules and macros but don't allow it for internal system use  */
        event?: MouseEvent | { originalEvent?: MouseEvent };
    }

    interface RollOptionConfig {
        extraRollOptions?: string[];
        item?: ItemPF2e | null;
        origin?: ActorPF2e | null;
        target?: ActorPF2e | null;
    }

    abstract class BaseStatistic<TActor extends ActorPF2e> {
        /** The actor to which this statistic belongs */
        actor: TActor;
        /** A stable but human-readable identifier */
        slug: string;
        /** A display label */
        label: string;
        /** Original construction arguments */
        protected data: StatisticData;
        /** String category identifiers: used to retrieve modifiers and other synthetics as well as create roll options  */
        domains: string[];
        /** Penalties, bonuses, and actual modifiers comprising a total modifier value */
        modifiers: ModifierPF2e[];
    }

    class StatisticCheck<TParent extends Statistic = Statistic> {
        modifiers: ModifierPF2e[];

        constructor(parent: TParent, data: StatisticData, config?: RollOptionConfig);

        roll(args?: StatisticRollParameters): Promise<Rolled<CheckRoll> | null>;
    }

    class Statistic<TActor extends ActorPF2e = ActorPF2e> extends BaseStatistic<TActor> {
        attribute: AttributeString | null;
        rank: ZeroToFour | null;
        proficient: boolean;
        /** The `Statistic` from which this one was derived (set by `Statistic#extend`), or otherwise `null`. */
        base: Statistic | null;
        /** If this is a skill, returns whether it is a lore skill or not */
        lore?: boolean;
        config: RollOptionConfig;

        constructor(actor: TActor, data: StatisticData, config?: RollOptionConfig);

        get attributeModifier(): ModifierPF2e | null;
        get check(): StatisticCheck<this>;
        get dc(): StatisticDifficultyClass<this>;
        get mod(): number;

        roll(args?: StatisticRollParameters): Promise<Rolled<CheckRoll> | null>;
        getChatData(options?: RollOptionConfig): StatisticChatData;

        getTraceData(
            this: Statistic<CreaturePF2e>,
            options?: { value?: "dc" | "mod" }
        ): StatisticTraceData<AttributeString>;
        getTraceData(options?: { value?: "dc" | "mod" }): StatisticTraceData;
        getTraceData(options?: { value?: "dc" | "mod" }): StatisticTraceData;
    }

    class StatisticDifficultyClass<TParent extends Statistic = Statistic> {
        parent: TParent;
        domains: string[];
        label?: string;
        modifiers: ModifierPF2e[];
        options: Set<string>;

        get value(): number;
        get breakdown(): string;
        toString(): string;
    }
}
