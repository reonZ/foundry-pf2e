export {};

declare global {
    interface CreatureSheetData<TActor extends CreaturePF2e> extends ActorSheetDataPF2e<TActor> {
        actorSizes: typeof CONFIG.PF2E.actorSizes;
        rarity: typeof CONFIG.PF2E.rarityTraits;
        frequencies: typeof CONFIG.PF2E.frequencies;
        pfsFactions: typeof CONFIG.PF2E.pfsFactions;
        languages: { slug: Language | null; label: string }[];
        initiativeOptions: FormSelectOption[];
        dying: {
            maxed: boolean;
            remainingDying: number;
            remainingWounded: number;
        };
    }

    abstract class CreatureSheetPF2e<TActor extends CreaturePF2e> extends ActorSheetPF2e<TActor> {}

    class FamiliarSheetPF2e<
        TActor extends FamiliarPF2e = FamiliarPF2e
    > extends CreatureSheetPF2e<TActor> {}
}
