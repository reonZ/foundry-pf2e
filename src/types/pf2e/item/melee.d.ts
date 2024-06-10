export {};

declare global {
    type MeleeSource = BaseItemSourcePF2e<"melee", MeleeSystemSource> & {
        flags: DeepPartial<MeleeFlags>;
    };

    type MeleeFlags = ItemFlagsPF2e & {
        pf2e: {
            linkedWeapon?: string;
        };
    };

    interface MeleeSystemData
        extends ItemSystemModel<MeleePF2e, NPCAttackSystemSchema>,
            Omit<ModelPropsFromSchema<NPCAttackSystemSchema>, "description"> {}

    type NPCAttackSystemSchema = Omit<ItemSystemSchema, "traits"> & {
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
                foundry.data.fields.StringField<NPCAttackTrait, NPCAttackTrait, true, false, false>,
                NPCAttackTrait[],
                NPCAttackTrait[],
                true,
                false,
                true
            >;
        }>;
        damageRolls: RecordField<
            foundry.data.fields.StringField<string, string, true, false, false>,
            foundry.data.fields.SchemaField<{
                damage: foundry.data.fields.StringField<string, string, true, false, false>;
                damageType: foundry.data.fields.StringField<
                    DamageType,
                    DamageType,
                    true,
                    false,
                    false
                >;
                category: foundry.data.fields.StringField<
                    DamageCategoryUnique,
                    DamageCategoryUnique,
                    true,
                    true,
                    true
                >;
            }>,
            true,
            false,
            true,
            true
        >;
        /** The base attack modifier for this attack  */
        bonus: foundry.data.fields.SchemaField<{
            value: foundry.data.fields.NumberField<number, number, true, false, true>;
        }>;
        attackEffects: foundry.data.fields.SchemaField<{
            value: foundry.data.fields.ArrayField<
                foundry.data.fields.StringField<string, string, true, false, false>
            >;
        }>;
    };

    type NPCAttackTrait = string;

    type MeleeSystemSource = SourceFromSchema<NPCAttackSystemSchema> & {
        level?: never;
        schema?: ItemSystemSource["schema"];
    };

    type NPCAttackDamage = SourceFromSchema<NPCAttackSystemSchema>["damageRolls"]["string"];
    type NPCAttackTraits = ItemTraitsNoRarity<NPCAttackTrait>;

    class MeleePF2e<TParent extends ActorPF2e | null = ActorPF2e | null> extends ItemPF2e<TParent> {
        get isMelee(): boolean;
        get isThrown(): boolean;
        get range(): RangeData | null;
    }

    interface MeleePF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        flags: MeleeFlags;
        readonly _source: MeleeSource;
        system: MeleeSystemData;
    }
}
