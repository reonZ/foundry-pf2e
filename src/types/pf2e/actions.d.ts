export {};

declare global {
    type ActionGlyph =
        | "A"
        | "D"
        | "T"
        | "R"
        | "F"
        | "a"
        | "d"
        | "t"
        | "r"
        | "f"
        | 1
        | 2
        | 3
        | "1"
        | "2"
        | "3";

    interface CheckResultCallback {
        actor: ActorPF2e;
        message?: ChatMessage;
        outcome: DegreeOfSuccessString | null | undefined;
        roll: Rolled<CheckRoll>;
    }

    interface SingleCheckActionVariantData extends BaseActionVariantData {
        difficultyClass?: CheckDC | DCSlug;
        modifiers?: RawModifier[];
        notes?: SingleCheckActionRollNoteData[];
        rollOptions?: string[];
        statistic?: string | string[];
    }

    type SingleCheckActionRollNoteData = Omit<RollNoteSource, "selector"> & { selector?: string };

    interface BaseActionVariantData {
        cost?: ActionCost;
        description?: string;
        name?: string;
        slug?: string;
        traits?: ActionTrait[];
    }

    interface ActionVariantUseOptions extends Record<string, unknown> {
        actors: ActorPF2e | ActorPF2e[];
        event: Event;
        traits: ActionTrait[];
        target: ActorPF2e | TokenPF2e;
    }

    interface ActionDefaultOptions {
        event?: JQuery.TriggeredEvent | Event | null;
        actors?: ActorPF2e | ActorPF2e[];
        glyph?: ActionGlyph;
        modifiers?: ModifierPF2e[];
        callback?: (result: CheckResultCallback) => void;
    }

    interface SkillActionOptions extends ActionDefaultOptions {
        skill?: string;
        difficultyClass?: CheckDC;
    }

    interface ActionDefaultOptions {
        event?: JQuery.TriggeredEvent | Event | null;
        actors?: ActorPF2e | ActorPF2e[];
        glyph?: ActionGlyph;
        modifiers?: ModifierPF2e[];
        callback?: (result: CheckResultCallback) => void;
    }

    interface BaseActionVariant extends ActionVariant {}

    interface BaseAction<
        TData extends BaseActionVariantData = BaseActionVariantData,
        TAction extends BaseActionVariant = BaseActionVariant
    > extends Action {}

    interface SingleCheckActionVariant extends BaseActionVariant {}

    interface SingleCheckAction
        extends BaseAction<SingleCheckActionVariantData, SingleCheckActionVariant> {}
}
