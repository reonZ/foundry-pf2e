declare function canUseStances(actor: CharacterPF2e): boolean;
declare function isValidStance(stance: ItemPF2e): stance is FeatPF2e | AbilityItemPF2e;
declare function getStances(actor: CharacterPF2e): toolbelt.stances.StanceData[];
declare function getStanceEffects(actor: CharacterPF2e): StanceDataWithEffect[];
declare function toggleStance(actor: CharacterPF2e, effectUUID: string, force?: boolean): Promise<"no-combat" | undefined>;
declare function addStance(actor: CharacterPF2e, effectUUID: string): Promise<void>;
type StanceData = toolbelt.stances.StanceData;
type StanceDataWithEffect = Omit<StanceData, "effectID"> & {
    effectID: string;
};
export { addStance, canUseStances, getStanceEffects, getStances, isValidStance, toggleStance };
