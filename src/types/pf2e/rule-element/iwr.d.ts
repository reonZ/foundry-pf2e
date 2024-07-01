export {};

declare global {
    type IWRExceptionField<TType extends string = string> = DataUnionField<
        | StrictStringField<TType, TType, true, false, false>
        | foundry.data.fields.SchemaField<{
              definition: PredicateField<true, false, false>;
              label: StrictStringField<string, string, true, false, false>;
          }>,
        true,
        false,
        false
    >;

    type IWRException<TType extends IWRType = IWRType> =
        | TType
        | { definition: Predicate; label: string };

    type IWRChangeMode = Extract<AELikeChangeMode, "add" | "remove">;

    interface IWRRuleElementSource extends RuleElementSource {
        mode?: unknown;
        type?: unknown;
        exceptions?: unknown;
        override?: unknown;
    }

    type IWRRuleSchema = RuleElementSchema & {
        /** Whether to add or remove an immunity, weakness, or resistance (default is "add") */
        mode: foundry.data.fields.StringField<IWRChangeMode, IWRChangeMode, true, false, true>;
        /** One or more IWR types: "custom" is also an acceptable value, but it must be used in isolation. */
        type: foundry.data.fields.ArrayField<
            foundry.data.fields.StringField<string, string, true, false, false>
        >;
        /**
         * A list of exceptions, which may include string values corresponding with the IWR type or objects defining custom
         * exceptions
         */
        exceptions: StrictArrayField<IWRExceptionField>;
        /** A definition for a "custom"-type IWR */
        definition: PredicateField<false, false, false>;
        /** Whether to override an existing IWR of the same type, even if it's higher */
        override: foundry.data.fields.BooleanField;
    };

    interface WeaknessRuleElement
        extends IWRRuleElement<WeaknessRuleSchema>,
            ModelPropsFromRESchema<WeaknessRuleSchema> {
        value: RuleValue;

        // Just a string at compile time, but ensured by parent class at runtime
        type: WeaknessType[];

        // Typescript 4.9 doesn't fully resolve conditional types, so it is redefined here
        exceptions: IWRException<WeaknessType>[];
    }

    type WeaknessRuleSchema = Omit<IWRRuleSchema, "exceptions"> & {
        value: ResolvableValueField<true, false, false>;
        exceptions: StrictArrayField<IWRExceptionField>;
    };

    type ImmunityRuleSchema = Omit<IWRRuleSchema, "exceptions"> & {
        exceptions: StrictArrayField<IWRExceptionField<ImmunityType>>;
    };

    abstract class IWRRuleElement<TSchema extends IWRRuleSchema> extends RuleElementPF2e<TSchema> {}

    class ImmunityRuleElement extends IWRRuleElement<ImmunityRuleSchema> {}

    class WeaknessRuleElement extends IWRRuleElement<WeaknessRuleSchema> {}
}
