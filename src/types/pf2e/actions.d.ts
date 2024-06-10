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

    interface ActionDefaultOptions {
        event?: JQuery.TriggeredEvent | Event | null;
        actors?: ActorPF2e | ActorPF2e[];
        glyph?: ActionGlyph;
        modifiers?: ModifierPF2e[];
        callback?: (result: CheckResultCallback) => void;
    }
}
