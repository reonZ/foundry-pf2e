export {};

declare global {
    type ClassSource = BaseItemSourcePF2e<"class", ClassSystemSource>;

    interface ClassSystemSource extends ABCSystemSource {
        traits: RarityTraitAndOtherTags;
        keyAbility: { value: AttributeString[]; selected: AttributeString | null };
        hp: number;
        perception: ZeroToFour;
        savingThrows: Record<SaveType, ZeroToFour>;
        attacks: ClassAttackProficiencies;
        defenses: ClassDefenseProficiencies;
        /** Starting proficiency in "spell attack rolls and DCs" */
        spellcasting: ZeroToFour;
        trainedSkills: {
            value: SkillSlug[];
            additional: number;
        };
        ancestryFeatLevels: { value: number[] };
        classFeatLevels: { value: number[] };
        generalFeatLevels: { value: number[] };
        skillFeatLevels: { value: number[] };
        skillIncreaseLevels: { value: number[] };
        level?: never;
    }

    interface ClassSystemData
        extends Omit<ClassSystemSource, "description">,
            Omit<ABCSystemData, "level" | "traits"> {}

    interface ClassAttackProficiencies {
        simple: ZeroToFour;
        martial: ZeroToFour;
        advanced: ZeroToFour;
        unarmed: ZeroToFour;
        other: { name: string; rank: ZeroToFour };
    }

    interface ClassDefenseProficiencies {
        unarmored: ZeroToFour;
        light: ZeroToFour;
        medium: ZeroToFour;
        heavy: ZeroToFour;
    }

    type ClassTrait =
        | "alchemist"
        | "barbarian"
        | "bard"
        | "champion"
        | "cleric"
        | "druid"
        | "fighter"
        | "gunslinger"
        | "kineticist"
        | "inventor"
        | "investigator"
        | "magus"
        | "monk"
        | "oracle"
        | "psychic"
        | "ranger"
        | "rogue"
        | "sorcerer"
        | "summoner"
        | "swashbuckler"
        | "thaumaturge"
        | "witch"
        | "wizard";

    class ClassPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ABCItemPF2e<TParent> {}

    interface ClassPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ABCItemPF2e<TParent> {
        readonly _source: ClassSource;
        system: ClassSystemData;

        get slug(): ClassTrait | null;
    }
}
