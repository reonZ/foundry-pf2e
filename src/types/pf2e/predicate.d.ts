export {};

declare global {
    type EqualTo = { eq: [string, string | number] };
    type GreaterThan = { gt: [string, string | number] };
    type GreaterThanEqualTo = { gte: [string, string | number] };
    type LessThan = { lt: [string, string | number] };
    type LessThanEqualTo = { lte: [string, string | number] };
    type BinaryOperation = EqualTo | GreaterThan | GreaterThanEqualTo | LessThan | LessThanEqualTo;
    type Atom = string | BinaryOperation;

    type Conjunction = { and: PredicateStatement[] };
    type Disjunction = { or: PredicateStatement[] };
    type ExclusiveDisjunction = { xor: PredicateStatement[] };
    type Negation = { not: PredicateStatement };
    type AlternativeDenial = { nand: PredicateStatement[] };
    type JointDenial = { nor: PredicateStatement[] };
    type Conditional = { if: PredicateStatement; then: PredicateStatement };
    type Biconditional = { iff: PredicateStatement[] };
    type CompoundStatement =
        | Conjunction
        | Disjunction
        | ExclusiveDisjunction
        | AlternativeDenial
        | JointDenial
        | Negation
        | Conditional
        | Biconditional;

    type PredicateStatement = Atom | CompoundStatement;
    type RawPredicate = PredicateStatement[];

    class Predicate extends Array<PredicateStatement> {
        constructor(...statements: PredicateStatement[] | [PredicateStatement[]]);

        static test(predicate?: PredicateStatement[], options?: Set<string> | string[]): boolean;

        test(options: Set<string> | string[]): boolean;
    }
}
