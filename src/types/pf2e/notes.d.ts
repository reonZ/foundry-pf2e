export {};

declare global {
    interface RollNoteSource {
        selector: string;
        title?: string | null;
        text: string;
        predicate?: RawPredicate;
        outcome?: DegreeOfSuccessString[];
        visibility?: UserVisibility | null;
    }

    interface RollNoteParams extends RollNoteSource {
        rule?: RuleElementPF2e | null;
    }
}
