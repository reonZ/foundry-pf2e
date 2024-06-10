export {};

declare global {
    interface ItemAlteration
        extends foundry.abstract.DataModel<RuleElementPF2e, ItemAlterationSchema>,
            ModelPropsFromSchema<ItemAlterationSchema> {}

    type ItemAlterationSchema = {
        mode: foundry.data.fields.StringField<
            AELikeChangeMode,
            AELikeChangeMode,
            true,
            false,
            false
        >;
        property: foundry.data.fields.StringField<
            ItemAlterationProperty,
            ItemAlterationProperty,
            true,
            false,
            false
        >;
        value: ResolvableValueField<true, true, false>;
    };

    type ItemAlterationProperty =
        | "traits"
        | "description"
        | "hardness"
        | "persistent-damage"
        | "rarity"
        | "bulk"
        | "category"
        | "strength"
        | "ac-bonus"
        | "badge-max"
        | "badge-value"
        | "check-penalty"
        | "damage-dice-faces"
        | "damage-type"
        | "defense-passive"
        | "dex-cap"
        | "focus-point-cost"
        | "frequency-max"
        | "frequency-per"
        | "hp-max"
        | "material-type"
        | "other-tags"
        | "pd-recovery-dc"
        | "speed-penalty";

    class ItemAlteration extends foundry.abstract.DataModel<
        RuleElementPF2e,
        ItemAlterationSchema
    > {}
}
