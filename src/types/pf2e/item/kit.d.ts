export {};

declare global {
    interface KitSystemData
        extends ItemSystemModel<KitPF2e, KitSystemSchema>,
            Omit<ModelPropsFromSchema<KitSystemSchema>, "description"> {}

    type KitEntryData = NonNullable<KitSystemData["items"][string]>;

    type KitEntryValueSchema = {
        uuid: foundry.data.fields.DocumentUUIDField<ItemUUID, true, false, false>;
        img: foundry.data.fields.FilePathField<ImageFilePath, ImageFilePath, true, false, false>;
        quantity: foundry.data.fields.NumberField<number, number, true, false, false>;
        name: foundry.data.fields.StringField<string, string, true, false, false>;
        isContainer: foundry.data.fields.BooleanField<boolean, boolean, true, false, false>;
        items: KitEntriesField | NullField;
    };

    type KitSystemSchema = Omit<ItemSystemSchema, "traits"> & {
        traits: foundry.data.fields.SchemaField<{
            otherTags: foundry.data.fields.ArrayField<
                SlugField<true, false, false>,
                string[],
                string[],
                true,
                false,
                true
            >;
            value: foundry.data.fields.ArrayField<
                foundry.data.fields.StringField<ClassTrait, ClassTrait, true, false, false>,
                ClassTrait[],
                ClassTrait[],
                true,
                false,
                true
            >;
        }>;
        items: KitEntriesField;
        price: PriceField;
    };

    class KitEntriesField extends RecordField<
        foundry.data.fields.StringField<string, string, true, false, false>,
        foundry.data.fields.SchemaField<KitEntryValueSchema>,
        true,
        false,
        true,
        true
    > {}

    type KitSystemSource = SourceFromSchema<KitSystemSchema> & {
        level?: never;
        schema?: ItemSystemSource["schema"];
    };

    type KitSource = BaseItemSourcePF2e<"kit", KitSystemSource>;

    class KitPF2e<TParent extends ActorPF2e | null = ActorPF2e | null> extends ItemPF2e<TParent> {}

    interface KitPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: KitSource;
        system: KitSystemData;
    }
}
