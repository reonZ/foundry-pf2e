export {};

declare global {
    interface NumericTermData extends RollTermData {
        class?: "NumericTerm";
        number: number;
    }

    abstract class RollTerm<TTermData extends RollTermData = RollTermData> {}

    class NumericTerm<TData extends NumericTermData = NumericTermData> extends RollTerm<TData> {}
}
