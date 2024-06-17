export {};

declare global {
    type RollTwiceOption = "keep-higher" | "keep-lower" | false;

    type CheckType =
        | "attack-roll"
        | "check"
        | "counteract-check"
        | "flat-check"
        | "initiative"
        | "perception-check"
        | "saving-throw"
        | "skill-check";

    type CheckRollCallback = (
        roll: Rolled<CheckRoll>,
        outcome: DegreeOfSuccessString | null | undefined,
        message: ChatMessagePF2e,
        event: Event | null
    ) => Promise<void> | void;

    interface CheckCheckContext extends BaseRollContext {
        /** The type of this roll, like 'perception-check' or 'saving-throw'. */
        type?: CheckType;
        /** A string of some kind to identify the roll: will be included in `CheckRoll#options` */
        identifier?: Maybe<string>;
        /** The slug of an action, of which this roll is a workflow component */
        action?: Maybe<string>;
        /** Should this roll be rolled twice? If so, should it keep highest or lowest? */
        rollTwice?: RollTwiceOption;
        /** The actor which initiated this roll. */
        actor?: ActorPF2e;
        /** The token which initiated this roll. */
        token?: TokenDocumentPF2e | null;
        /** The originating item of this attack, if any */
        item?: ItemPF2e<ActorPF2e> | null;
        /** Optional title of the roll options dialog; defaults to the check name */
        title?: string;
        /** Optional DC data for the check */
        dc?: CheckDC | null;
        /** The domains this roll had, for reporting purposes */
        domains?: string[];
        /** Is this check part of an action that deals damage? */
        damaging?: boolean;
        /** Is the roll a reroll? */
        isReroll?: boolean;
        /** The number of MAP increases for this roll */
        mapIncreases?: Maybe<ZeroToTwo>;
        /** D20 results substituted for an actual roll */
        substitutions?: RollSubstitution[];
        /** Is the weapon used in this attack roll an alternative usage? */
        altUsage?: Maybe<"thrown" | "melee">;
        /** Degree of success adjustments from synthetics and hard-coded sources */
        dosAdjustments?: DegreeOfSuccessAdjustment[];
    }

    interface CheckRollDataPF2e extends RollDataPF2e {
        type?: CheckType;
        /** A string of some kind to help system API identify the roll */
        identifier?: Maybe<string>;
        /** The slug of an action associated with this roll */
        action?: Maybe<string>;
        isReroll?: boolean;
        degreeOfSuccess?: ZeroToThree;
        /** Whether the check is part of a damaging action */
        damaging?: boolean;
        domains?: string[];
    }

    class CheckRoll extends Roll {
        get degreeOfSuccess(): DegreeOfSuccessIndex | null;
    }

    interface CheckRoll extends Roll {
        options: CheckRollDataPF2e & { showBreakdown: boolean };
    }

    class CheckPF2e {
        /** Roll the given statistic, optionally showing the check modifier dialog if 'Shift' is held down. */
        static roll(
            check: CheckModifier,
            context?: CheckCheckContext,
            event?: JQuery.TriggeredEvent | Event | null,
            callback?: CheckRollCallback
        ): Promise<Rolled<CheckRoll> | null>;
    }
}
