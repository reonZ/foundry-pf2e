declare const EFFECT_AREA_SHAPES: readonly ["burst", "cone", "cube", "cylinder", "emanation", "line", "square"];
declare const MAGIC_TRADITIONS: Set<"arcane" | "divine" | "occult" | "primal">;
declare function spellSlotGroupIdToNumber(groupId: SpellSlotGroupId): ZeroToTen;
declare function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null;
export { EFFECT_AREA_SHAPES, MAGIC_TRADITIONS, spellSlotGroupIdToNumber };
