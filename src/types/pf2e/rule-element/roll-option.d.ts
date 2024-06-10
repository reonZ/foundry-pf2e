export {};

declare global {
    type RollOptionSchema = RuleElementSchema & {
        domain: foundry.data.fields.StringField<string, string, true, false, true>;
        phase: foundry.data.fields.StringField<
            AELikeDataPrepPhase,
            AELikeDataPrepPhase,
            false,
            false,
            true
        >;
        option: foundry.data.fields.StringField<string, string, true, false, false>;
        /** Suboptions for a toggle, appended to the option string */
        suboptions: foundry.data.fields.ArrayField<SuboptionField>;
        /**
         * The value of the roll option: either a boolean or a string resolves to a boolean If omitted, it defaults to
         * `true` unless also `togglable`, in which case to `false`.
         */
        value: ResolvableValueField<false, false, true>;
        /** Whether this instance's suboptions are mergeable with an already-present, toggleable `RollOption` */
        mergeable: foundry.data.fields.BooleanField<boolean, boolean, false, false, true>;
        /** A suboption selection */
        selection: foundry.data.fields.StringField<string, string, false, false, false>;
        /** Whether the roll option is toggleable: a checkbox will appear in interfaces (usually actor sheets) */
        toggleable: DataUnionField<
            StrictStringField<"totm"> | StrictBooleanField,
            false,
            false,
            true
        >;
        /** If toggleable, the location to be found in an interface */
        placement: foundry.data.fields.StringField<string, string, false, false, false>;
        /** An optional predicate to determine whether the toggle is interactable by the user */
        disabledIf: PredicateField<false, false, false>;
        /** The value of the roll option if its toggle is disabled: null indicates the pre-disabled value is preserved */
        disabledValue: foundry.data.fields.BooleanField<boolean, boolean, false, false, false>;
        /**
         * Whether this (toggleable and suboptions-containing) roll option always has a `value` of `true`, allowing only
         * suboptions to be changed
         */
        alwaysActive: foundry.data.fields.BooleanField<boolean, boolean, false, false, false>;
        /** Whether this roll option is countable: it will have a numeric value counting how many rules added this option */
        count: foundry.data.fields.BooleanField<boolean, boolean, false, false, false>;
        /** If the hosting item is an effect, remove or expire it after a matching roll is made */
        removeAfterRoll: foundry.data.fields.BooleanField<boolean, boolean, false, false, false>;
    };

    type SuboptionSchema = {
        label: foundry.data.fields.StringField<string, string, true, false, false>;
        value: foundry.data.fields.StringField<string, string, true, false, false>;
        predicate: PredicateField;
    };
    type SuboptionSource = SourceFromSchema<SuboptionSchema>;
    type SuboptionField = foundry.data.fields.EmbeddedDataField<Suboption, true, false, false>;

    class RollOptionRuleElement extends RuleElementPF2e<RollOptionSchema> {}

    class Suboption extends foundry.abstract.DataModel<RollOptionRuleElement, SuboptionSchema> {}
}
