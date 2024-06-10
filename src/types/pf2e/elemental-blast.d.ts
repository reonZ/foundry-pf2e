export {};

declare global {
    interface CreateModifiedItemParams {
        melee: boolean;
        config?: ElementalBlastConfig;
        damageType?: DamageType;
    }

    interface BlastAttackParams extends AttackRollParams {
        mapIncreases: number;
        element: ElementTrait;
        damageType: DamageType;
        melee: boolean;
    }

    interface BlastDamageParams extends DamageRollParams {
        element: ElementTrait;
        damageType: DamageType;
        melee: boolean;
        actionCost?: number;
        outcome?: "success" | "criticalSuccess";
    }

    type BlastConfigSchema = {
        element: foundry.data.fields.StringField<ElementTrait, ElementTrait, true, false, false>;
        label: foundry.data.fields.StringField<string, string, true, false, false>;
        img: foundry.data.fields.FilePathField<ImageFilePath, ImageFilePath, true, false, true>;
        damageTypes: foundry.data.fields.ArrayField<
            foundry.data.fields.StringField<DamageType, DamageType, true, false, false>
        >;
        range: foundry.data.fields.NumberField<number, number, true, false, false>;
        dieFaces: foundry.data.fields.NumberField<6 | 8, 6 | 8, true, false, false>;
    };

    type BlastInfusionSchema = {
        damageTypes: foundry.data.fields.ArrayField<
            foundry.data.fields.StringField<DamageType, DamageType, true, false, false>
        >;
        range: foundry.data.fields.SchemaField<
            {
                increment: foundry.data.fields.NumberField<number, number, true, false, false>;
                max: foundry.data.fields.NumberField<number, number, true, false, false>;
            },
            { increment: number; max: number },
            { increment: number; max: number },
            false,
            true,
            true
        >;
        traits: foundry.data.fields.SchemaField<{
            melee: foundry.data.fields.ArrayField<
                foundry.data.fields.StringField<WeaponTrait, WeaponTrait, true, false, false>
            >;
            ranged: foundry.data.fields.ArrayField<
                foundry.data.fields.StringField<WeaponTrait, WeaponTrait, true, false, false>
            >;
        }>;
    };

    type BlastInfusionData = ModelPropsFromSchema<BlastInfusionSchema>;

    interface ElementalBlastConfig
        extends Omit<ModelPropsFromSchema<BlastConfigSchema>, "damageTypes" | "range"> {
        damageTypes: BlastConfigDamageType[];
        range: RangeData & { label: string };
        statistic: Statistic;
        actionCost: 1 | 2;
        maps: {
            melee: { map0: string; map1: string; map2: string };
            ranged: { map0: string; map1: string; map2: string };
        };
    }

    interface BlastConfigDamageType {
        value: DamageType;
        label: string;
        icon: string;
        selected: boolean;
    }

    interface ElementalBlastSheetConfig extends ElementalBlastConfig {
        damageType: DamageType;
        formula: {
            ranged: { damage: string | null; critical: string | null };
            melee: { damage: string | null; critical: string | null };
        };
    }

    class ElementalBlast {
        actor: CharacterPF2e;
        /** The actor's impulse statistic */
        statistic: Statistic | null;
        /** The actor's Elemental Blast item */
        item: AbilityItemPF2e<CharacterPF2e> | null;
        /** Blast element/damage-type configurations available to the character */
        configs: ElementalBlastConfig[];
        /** Modifications of the blast from infusions */
        infusion: BlastInfusionData | null;

        constructor(actor: CharacterPF2e);

        setDamageType(options: { element: ElementTrait; damageType: DamageType }): Promise<void>;

        attack(params: BlastAttackParams): Promise<Rolled<CheckRoll> | null>;

        damage(params: BlastDamageParams & { getFormula: true }): Promise<string | null>;
        damage(params: BlastDamageParams): Promise<Rolled<DamageRoll> | string | null>;
        damage(params: BlastDamageParams): Promise<Rolled<DamageRoll> | string | null>;
    }
}
