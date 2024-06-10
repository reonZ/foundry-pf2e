export {};
declare global {
    interface AutoChangeEntry {
        source: string;
        level: number | null;
        value: boolean | number | string | null;
        mode: AELikeChangeMode;
    }
    type RuleElementSource = {
        key?: JSONValue;
        label?: JSONValue;
        slug?: JSONValue;
        predicate?: JSONValue;
        priority?: JSONValue;
        ignored?: JSONValue;
        requiresInvestment?: JSONValue;
        requiresEquipped?: JSONValue;
        removeUponCreate?: JSONValue;
    };
    type AELikeChangeMode = "override" | "multiply" | "add" | "remove" | "upgrade" | "subtract" | "downgrade";
    type AELikeDataPrepPhase = "beforeRoll" | "applyAEs" | "beforeDerived" | "afterDerived";
    type RuleElementSchema = {
        key: foundry.data.fields.StringField<string, string, true, false, false>;
        /** An identifying slug for the rule element: its significance and restrictions are determined per RE type */
        slug: SlugField;
        /** A label for use by any rule element for display in an interface */
        label: foundry.data.fields.StringField<string, string, false, false, false>;
        /** The place in order of application (ascending), among an actor's list of rule elements */
        priority: foundry.data.fields.NumberField<number, number, true, false, true>;
        /** A test of whether the rules element is to be applied */
        predicate: PredicateField;
        /** Whether the rule element is ignored and deactivated */
        ignored: foundry.data.fields.BooleanField<boolean, boolean, false, false, true>;
        /** Whether the rule element requires that the parent item (if physical) be equipped */
        requiresEquipped: foundry.data.fields.BooleanField<boolean, boolean, false, true, false>;
        /** Whether the rule element requires that the parent item (if physical) be invested */
        requiresInvestment: foundry.data.fields.BooleanField<boolean, boolean, false, true, false>;
        /** A grouping slug to mark a rule as a part of a spinoff effect, which some item types can compose */
        spinoff: SlugField<false, false, false>;
    };
    type SourcePropFromDataField<T> = T extends foundry.data.fields.DataField<infer TSourceProp, infer _TModelProp, infer TRequired, infer TNullable, infer THasInitial> ? MaybeSchemaProp<TSourceProp, TRequired, TNullable, THasInitial> : never;
    type ModelPropFromDataField<T> = T extends foundry.data.fields.DataField<infer _TSourceProp, infer TModelProp, infer TRequired, infer TNullable, infer THasInitial> ? MaybeSchemaProp<TModelProp, TRequired, TNullable, THasInitial> : never;
    class StrictArrayField<TElementField extends foundry.data.fields.DataField, TSourceProp extends Partial<SourcePropFromDataField<TElementField>>[] = SourcePropFromDataField<TElementField>[], TModelProp extends object = ModelPropFromDataField<TElementField>[], TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true> extends foundry.data.fields.ArrayField<TElementField, TSourceProp, TModelProp, TRequired, TNullable, THasInitial> {
    }
    interface PredicateStatementField extends foundry.data.fields.DataField<PredicateStatement, PredicateStatement, true, false, false> {
    }
    class PredicateField<TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true> extends StrictArrayField<PredicateStatementField, RawPredicate, Predicate, TRequired, TNullable, THasInitial> {
    }
    class StrictBooleanField<TRequired extends boolean = false, TNullable extends boolean = false, THasInitial extends boolean = true> extends foundry.data.fields.BooleanField<boolean, boolean, TRequired, TNullable, THasInitial> {
    }
    class StrictStringField<TSourceProp extends string, TModelProp extends NonNullable<JSONValue> = TSourceProp, TRequired extends boolean = false, TNullable extends boolean = false, THasInitial extends boolean = boolean> extends foundry.data.fields.StringField<TSourceProp, TModelProp, TRequired, TNullable, THasInitial> {
    }
    class SlugField<TRequired extends boolean = true, TNullable extends boolean = boolean, THasInitial extends boolean = boolean> extends StrictStringField<string, string, TRequired, TNullable, THasInitial> {
    }
    abstract class RuleElementPF2e<TSchema extends RuleElementSchema = RuleElementSchema> extends foundry.abstract.DataModel<ItemPF2e<ActorPF2e>, TSchema> {
    }
}
