export {};

declare global {
    type SpecialResourceSource = RuleElementSource & {
        value?: unknown;
        max?: unknown;
        itemUUID?: unknown;
        level?: unknown;
    };

    type SpecialResourceSchema = RuleElementSchema & {
        /** Current value. If not set, defaults to null */
        value: foundry.data.fields.NumberField<number, number, false, false>;
        /** The maximum value attainable for this resource. */
        max: ResolvableValueField<true, false>;
        /** If this represents a physical resource, the UUID of the item to create */
        itemUUID: foundry.data.fields.DocumentUUIDField<ItemUUID, false, false, false>;
        /** If itemUUID exists, determines the level of the granted item */
        level: ResolvableValueField<false, true, true>;
    };

    class SpecialResourceRuleElement extends RuleElementPF2e<SpecialResourceSchema> {
        itemUUID: ItemUUID;
    }
}
