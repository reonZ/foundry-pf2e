export {};

declare global {
    class DataModelValidationFailure {}

    type MaybeSchemaProp<
        TProp,
        TRequired extends boolean,
        TNullable extends boolean,
        THasInitial extends boolean
    > = TRequired extends true
        ? TNullable extends true
            ? TProp | null
            : TProp
        : TNullable extends true
        ? THasInitial extends true
            ? TProp | null
            : TProp | null | undefined
        : THasInitial extends true
        ? TProp
        : TProp | undefined;

    interface DataFieldOptions<
        TSourceProp,
        TRequired extends boolean,
        TNullable extends boolean,
        THasInitial extends boolean
    > {
        required?: TRequired;
        nullable?: TNullable;
        initial?: THasInitial extends true
            ?
                  | TSourceProp
                  | ((
                        data: Record<string, unknown>
                    ) => MaybeSchemaProp<TSourceProp, TRequired, TNullable, THasInitial>)
                  | null
            : THasInitial extends false
            ? undefined
            :
                  | TSourceProp
                  | ((
                        data: Record<string, unknown>
                    ) => MaybeSchemaProp<TSourceProp, TRequired, TNullable, THasInitial>)
                  | null
                  | undefined;
        validate?: (value: unknown) => DataModelValidationFailure | boolean | void;
        choices?:
            | readonly TSourceProp[]
            | Record<string, string>
            | (() => readonly TSourceProp[] | Record<string | number, string>);
        readonly?: boolean;
        label?: string;
        hint?: string;
        validationError?: string;
    }

    interface DataFieldContext {
        /** A field name to assign to the constructed field */
        name?: string;
        /** Another data field which is a hierarchical parent of this one */
        parent?: foundry.data.fields.DataField;
    }

    interface StringFieldOptions<
        TSourceProp extends string,
        TRequired extends boolean,
        TNullable extends boolean,
        THasInitial extends boolean
    > extends DataFieldOptions<TSourceProp, TRequired, TNullable, THasInitial> {
        choices?:
            | readonly TSourceProp[]
            | Record<TSourceProp, string>
            | (() => readonly TSourceProp[] | Record<TSourceProp, string>);
        /** [blank=true] Is the string allowed to be blank (empty)? */
        blank?: boolean;
        /** [trim=true]  Should any provided string be trimmed as part of cleaning? */
        trim?: boolean;
    }

    class RecordField<
        TKeyField extends
            | foundry.data.fields.StringField<string, string, true, false, false>
            | foundry.data.fields.NumberField<number, number, true, false, false>,
        TValueField extends foundry.data.fields.DataField,
        TRequired extends boolean = true,
        TNullable extends boolean = false,
        THasInitial extends boolean = true,
        TDense extends boolean = false
    > extends foundry.data.fields.ObjectField<
        RecordFieldSourceProp<TKeyField, TValueField, TDense>,
        RecordFieldModelProp<TKeyField, TValueField, TDense>,
        TRequired,
        TNullable,
        THasInitial
    > {}

    type RecordFieldModelProp<
        TKeyField extends
            | foundry.data.fields.StringField<string, string, true, false, false>
            | foundry.data.fields.NumberField<number, number, true, false, false>,
        TValueField extends foundry.data.fields.DataField,
        TDense extends boolean = false
    > = TDense extends true
        ? Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>
        : TDense extends false
        ? Partial<Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>>
        :
              | Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>
              | Partial<
                    Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>
                >;

    type RecordFieldSourceProp<
        TKeyField extends
            | foundry.data.fields.StringField<string, string, true, false, false>
            | foundry.data.fields.NumberField<number, number, true, false, false>,
        TValueField extends foundry.data.fields.DataField,
        /** Whether this is to be treated as a "dense" record; i.e., any valid key should return a value */
        TDense extends boolean = false
    > = TDense extends true
        ? Record<SourcePropFromDataField<TKeyField>, SourcePropFromDataField<TValueField>>
        : TDense extends false
        ? Partial<Record<SourcePropFromDataField<TKeyField>, SourcePropFromDataField<TValueField>>>
        :
              | Record<SourcePropFromDataField<TKeyField>, SourcePropFromDataField<TValueField>>
              | Partial<
                    Record<SourcePropFromDataField<TKeyField>, SourcePropFromDataField<TValueField>>
                >;

    interface Bracket<T extends object | number | string> {
        start?: number;
        end?: number;
        value: T;
    }

    interface BracketedValue<T extends object | number | string = object | number | string> {
        field?: string;
        brackets: Bracket<T>[];
    }

    type RuleValue = string | number | boolean | object | BracketedValue;

    interface ResolvableValueField<
        TRequired extends boolean,
        TNullable extends boolean,
        THasInitial extends boolean = false
    > extends foundry.data.fields.DataField<
            RuleValue,
            RuleValue,
            TRequired,
            TNullable,
            THasInitial
        > {}

    interface DataUnionField<
        TField extends foundry.data.fields.DataField,
        TRequired extends boolean = boolean,
        TNullable extends boolean = boolean,
        THasInitial extends boolean = boolean
    > extends foundry.data.fields.DataField<
            TField extends foundry.data.fields.DataField<infer TSourceProp> ? TSourceProp : never,
            TField extends foundry.data.fields.DataField<infer _TSourceProp, infer TModelProp>
                ? TModelProp
                : never,
            TRequired,
            TNullable,
            THasInitial
        > {}

    interface NullField extends foundry.data.fields.DataField<null, null, true, true, true> {}
}
