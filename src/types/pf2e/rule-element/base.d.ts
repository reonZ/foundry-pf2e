export {};

declare global {
    interface AutoChangeEntry {
        source: string;
        level: number | null;
        value: boolean | number | string | null;
        mode: AELikeChangeMode;
    }

    type ModelPropsFromRESchema<TSchema extends RuleElementSchema> = Omit<
        ModelPropsFromSchema<TSchema>,
        "label"
    >;

    type ChoiceSetSource = RuleElementSource & {
        selection?: unknown;
        rollOption?: string;
        flag?: string;
    };

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

    type AELikeChangeMode =
        | "override"
        | "multiply"
        | "add"
        | "remove"
        | "upgrade"
        | "subtract"
        | "downgrade";
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

    type SourcePropFromDataField<T> = T extends foundry.data.fields.DataField<
        infer TSourceProp,
        infer _TModelProp,
        infer TRequired,
        infer TNullable,
        infer THasInitial
    >
        ? MaybeSchemaProp<TSourceProp, TRequired, TNullable, THasInitial>
        : never;

    type ModelPropFromDataField<T> = T extends foundry.data.fields.DataField<
        infer _TSourceProp,
        infer TModelProp,
        infer TRequired,
        infer TNullable,
        infer THasInitial
    >
        ? MaybeSchemaProp<TModelProp, TRequired, TNullable, THasInitial>
        : never;

    class StrictArrayField<
        TElementField extends foundry.data.fields.DataField,
        TSourceProp extends Partial<
            SourcePropFromDataField<TElementField>
        >[] = SourcePropFromDataField<TElementField>[],
        TModelProp extends object = ModelPropFromDataField<TElementField>[],
        TRequired extends boolean = true,
        TNullable extends boolean = false,
        THasInitial extends boolean = true
    > extends foundry.data.fields.ArrayField<
        TElementField,
        TSourceProp,
        TModelProp,
        TRequired,
        TNullable,
        THasInitial
    > {}

    interface PredicateStatementField
        extends foundry.data.fields.DataField<
            PredicateStatement,
            PredicateStatement,
            true,
            false,
            false
        > {}

    class PredicateField<
        TRequired extends boolean = true,
        TNullable extends boolean = false,
        THasInitial extends boolean = true
    > extends StrictArrayField<
        PredicateStatementField,
        RawPredicate,
        Predicate,
        TRequired,
        TNullable,
        THasInitial
    > {}

    class StrictBooleanField<
        TRequired extends boolean = false,
        TNullable extends boolean = false,
        THasInitial extends boolean = true
    > extends foundry.data.fields.BooleanField<
        boolean,
        boolean,
        TRequired,
        TNullable,
        THasInitial
    > {}

    class StrictStringField<
        TSourceProp extends string,
        TModelProp extends NonNullable<JSONValue> = TSourceProp,
        TRequired extends boolean = false,
        TNullable extends boolean = false,
        THasInitial extends boolean = boolean
    > extends foundry.data.fields.StringField<
        TSourceProp,
        TModelProp,
        TRequired,
        TNullable,
        THasInitial
    > {}

    class SlugField<
        TRequired extends boolean = true,
        TNullable extends boolean = boolean,
        THasInitial extends boolean = boolean
    > extends StrictStringField<string, string, TRequired, TNullable, THasInitial> {}

    abstract class RuleElementPF2e<
        TSchema extends RuleElementSchema = RuleElementSchema
    > extends foundry.abstract.DataModel<ItemPF2e<ActorPF2e>, TSchema> {
        get item(): this["parent"];
        get actor(): ActorPF2e;
        get token(): TokenDocumentPF2e | null;
    }

    interface RuleElementPF2e<TSchema extends RuleElementSchema>
        extends foundry.abstract.DataModel<ItemPF2e<ActorPF2e>, TSchema>,
            ModelPropsFromSchema<RuleElementSchema> {
        constructor: typeof RuleElementPF2e<TSchema>;

        get schema(): LaxSchemaField<TSchema>;

        /**
         * Run between Actor#applyActiveEffects and Actor#prepareDerivedData. Generally limited to ActiveEffect-Like
         * elements
         */
        onApplyActiveEffects?(): void;

        /**
         * Run in Actor#prepareDerivedData which is similar to an init method and is the very first thing that is run after
         * an actor.update() was called. Use this hook if you want to save or modify values on the actual data objects
         * after actor changes. Those values should not be saved back to the actor unless we mess up.
         *
         * This callback is run for each rule in random order and is run very often, so watch out for performance.
         */
        beforePrepareData?(): void;

        /** Run after all actor preparation callbacks have been run so you should see all final values here. */
        afterPrepareData?(): void;

        /**
         * Run just prior to a check roll, passing along roll options already accumulated
         * @param domains Applicable predication domains for pending check
         * @param rollOptions Currently accumulated roll options for the pending check
         */
        beforeRoll?(domains: string[], rollOptions: Set<string>): void;

        /**
         * Run following a check roll, passing along roll options already accumulated
         * @param domains Applicable selectors for the pending check
         * @param domains Applicable predication domains for pending check
         * @param rollOptions Currently accumulated roll options for the pending check
         */
        afterRoll?(params: RuleElementPF2e.AfterRollParams): Promise<void>;

        /** Runs before the rule's parent item's owning actor is updated */
        preUpdateActor?(): Promise<{ create: ItemSourcePF2e[]; delete: string[] }>;

        /**
         * Runs before this rules element's parent item is created. The item is temporarilly constructed. A rule element can
         * alter itself before its parent item is stored on an actor; it can also alter the item source itself in the same
         * manner.
         */
        preCreate?({
            ruleSource,
            itemSource,
            pendingItems,
            operation,
        }: RuleElementPF2e.PreCreateParams): Promise<void>;

        /**
         * Runs before this rules element's parent item is created. The item is temporarilly constructed. A rule element can
         * alter itself before its parent item is stored on an actor; it can also alter the item source itself in the same
         * manner.
         */
        preDelete?({ pendingItems, operation }: RuleElementPF2e.PreDeleteParams): Promise<void>;

        /**
         * Runs before this rules element's parent item is updated */
        preUpdate?(changes: DeepPartial<ItemSourcePF2e>): Promise<void>;

        /**
         * Runs after an item holding this rule is added to an actor. If you modify or add the rule after the item
         * is already present on the actor, nothing will happen. Rules that add toggles won't work here since this method is
         * only called on item add.
         *
         * @param actorUpdates The first time a rule is run it receives an empty object. After all rules set various values
         * on the object, this object is then passed to actor.update(). This is useful if you want to set specific values on
         * the actor when an item is added. Keep in mind that the object for actor.update() is flattened, e.g.
         * {'data.attributes.hp.value': 5}.
         */
        onCreate?(actorUpdates: Record<string, unknown>): void;

        /**
         * Run at certain encounter events, such as the start of the actor's turn. Similar to onCreate and onDelete, this provides an opportunity to make
         * updates to the actor.
         * @param data.event        The type of event that triggered this callback
         * @param data.actorUpdates A record containing update data for the actor
         */
        onUpdateEncounter?(data: {
            event: "initiative-roll" | "turn-start";
            actorUpdates: Record<string, unknown>;
        }): Promise<void>;

        /**
         * Runs after an item holding this rule is removed from an actor. This method is used for cleaning up any values
         * on the actorData or token objects (e.g., removing temp HP).
         *
         * @param actorData data of the actor that holds the item
         * @param item the removed item data
         * @param actorUpdates see onCreate
         * @param tokens see onCreate
         */
        onDelete?(actorUpdates: Record<string, unknown>): void;

        /** An optional method for excluding damage modifiers and extra dice */
        applyDamageExclusion?(
            weapon: WeaponPF2e,
            modifiers: (DamageDicePF2e | ModifierPF2e)[]
        ): void;
    }

    namespace RuleElementPF2e {
        export interface PreCreateParams<T extends RuleElementSource = RuleElementSource> {
            /** The source partial of the rule element's parent item to be created */
            itemSource: ItemSourcePF2e;
            /** The source of the rule in `itemSource`'s `system.rules` array */
            ruleSource: T;
            /** All items pending creation in a `ItemPF2e.createDocuments` call */
            pendingItems: ItemSourcePF2e[];
            /** Items temporarily constructed from pending item source */
            tempItems: ItemPF2e<ActorPF2e>[];
            /** The `operation` object from the `ItemPF2e.createDocuments` call */
            operation: Partial<DatabaseCreateOperation<ActorPF2e | null>>;
            /** Whether this preCreate run is from a pre-update reevaluation */
            reevaluation?: boolean;
        }

        export interface PreDeleteParams {
            /** All items pending deletion in a `ItemPF2e.deleteDocuments` call */
            pendingItems: ItemPF2e<ActorPF2e>[];
            /** The context object from the `ItemPF2e.deleteDocuments` call */
            operation: Partial<DatabaseDeleteOperation<ActorPF2e | null>>;
        }

        export interface AfterRollParams {
            roll: Rolled<CheckRoll>;
            check: CheckModifier;
            context: CheckCheckContext;
            domains: string[];
            rollOptions: Set<string>;
        }
    }
}
