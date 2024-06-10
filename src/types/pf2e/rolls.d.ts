export {};

declare global {
    interface RollParameters {
        /** The triggering event */
        event?: MouseEvent | JQuery.TriggeredEvent;
        /** Any options which should be used in the roll. */
        options?: string[] | Set<string>;
        /** Optional DC data for the roll */
        dc?: CheckDC | null;
        /** Callback called when the roll occurs. */
        callback?: (roll: Rolled<Roll>) => void;
        /** Additional modifiers */
        modifiers?: ModifierPF2e[];
        /** Whether to create a message from the roll */
        createMessage?: boolean;
    }

    interface AttackRollParams extends RollParameters {
        /** A target token: pulled from `game.users.targets` if not provided */
        target?: TokenPF2e | null;
        /** Retrieve the formula of the strike roll without following through to the end */
        getFormula?: true;
        /** Should this strike consume ammunition, if applicable? */
        consumeAmmo?: boolean;
        /** The strike is involve throwing a thrown melee weapon or to use the melee usage of a combination weapon */
        altUsage?: "thrown" | "melee" | null;
        /** Should this roll be rolled twice? If so, should it keep highest or lowest? */
        rollTwice?: RollTwiceOption;
    }

    interface BaseRollContext {
        /** Any options which should be used in the roll. */
        options?: Set<string>;
        /** Any notes which should be shown for the roll. */
        notes?: (RollNotePF2e | RollNoteSource)[];
        /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
        rollMode?: RollMode | "roll";
        /** Origin data for the check, if applicable */
        origin?: RollOrigin | null;
        /** Targeting data for the check, if applicable */
        target?: RollTarget | null;
        /** Action traits associated with the roll */
        traits?: ActionTrait[];
        /** The outcome a roll (usually relevant only to rerolls) */
        outcome?: DegreeOfSuccessString | null;
        /** The outcome prior to being changed by abilities raising or lowering degree of success */
        unadjustedOutcome?: DegreeOfSuccessString | null;
        /** Should the roll be immediately created as a chat message? */
        createMessage?: boolean;
        /** Skip the roll dialog regardless of user setting  */
        skipDialog?: boolean;
    }

    interface RollDataPF2e extends RollOptions {
        rollerId?: string;
        totalModifier?: number;
        /** Whether to show roll formula and tooltip to players */
        showBreakdown?: boolean;
    }

    interface DamageRollParams extends Omit<AttackRollParams, "consumeAmmo" | "rollTwice"> {
        mapIncreases?: Maybe<ZeroToTwo>;
        checkContext?: Maybe<CheckContextChatFlag>;
    }
}
