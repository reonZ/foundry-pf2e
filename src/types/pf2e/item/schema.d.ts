export {};

declare global {
    abstract class ItemSystemModel<
        TParent extends ItemPF2e,
        TSchema extends ItemSystemSchema
    > extends foundry.abstract.TypeDataModel<TParent, TSchema> {}

    interface ItemSystemModel<TParent extends ItemPF2e, TSchema extends ItemSystemSchema>
        extends foundry.abstract.TypeDataModel<TParent, TSchema> {
        description: ItemDescriptionData;
    }

    type ItemSystemSchema = {
        description: foundry.data.fields.SchemaField<{
            value: foundry.data.fields.StringField<string, string, true, false, true>;
            gm: foundry.data.fields.StringField<string, string, true, false, true>;
        }>;
        publication: foundry.data.fields.SchemaField<{
            title: foundry.data.fields.StringField<string, string, true, false, true>;
            authors: foundry.data.fields.StringField<string, string, true, false, true>;
            license: foundry.data.fields.StringField<
                "OGL" | "ORC",
                "OGL" | "ORC",
                true,
                false,
                true
            >;
            remaster: foundry.data.fields.BooleanField<boolean, boolean, true, false, true>;
        }>;
        rules: foundry.data.fields.ArrayField<
            foundry.data.fields.ObjectField<
                RuleElementSource,
                RuleElementSource,
                true,
                false,
                false
            >,
            RuleElementSource[],
            RuleElementSource[],
            true,
            false,
            true
        >;
        slug: SlugField<true, true, true>;
        traits: foundry.data.fields.SchemaField<{
            otherTags: foundry.data.fields.ArrayField<
                SlugField<true, false, false>,
                string[],
                string[],
                true,
                false,
                true
            >;
        }>;
        _migration: foundry.data.fields.SchemaField<{
            version: foundry.data.fields.NumberField<number, number, true, true, true>;
            previous: foundry.data.fields.SchemaField<
                {
                    foundry: foundry.data.fields.StringField<string, string, true, true, true>;
                    system: foundry.data.fields.StringField<string, string, true, true, true>;
                    schema: foundry.data.fields.NumberField<number, number, true, true, true>;
                },
                { foundry: string | null; system: string | null; schema: number | null },
                { foundry: string | null; system: string | null; schema: number | null },
                true,
                true,
                true
            >;
        }>;
    };
}
