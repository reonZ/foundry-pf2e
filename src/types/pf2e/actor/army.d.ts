export {};

declare global {
    type ArmySource = BaseActorSourcePF2e<"army", ArmySystemSource>;

    interface ArmySystemSource extends ActorSystemSource {
        ac: ArmyArmorClass;
        attributes: ArmyAttributesSource;
        details: ArmyDetailsSource;
        traits: ArmyTraitsSource;

        consumption: number;
        scouting: number;
        recruitmentDC: number;

        resources: ArmyResourcesSource;

        saves: {
            maneuver: number;
            morale: number;
        };

        weapons: {
            ranged: ArmyWeaponData | null;
            melee: ArmyWeaponData | null;
        };
    }

    interface ArmyWeaponData {
        name: string;
        potency: number;
    }

    interface ArmyArmorClass {
        value: number;
        potency: number;
    }

    type Alignment = "CE" | "LE" | "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "NE";

    interface ArmyTraitsSource extends Required<ActorTraitsSource<string>> {
        languages?: never;
        type: "cavalry" | "infantry" | "siege" | "skirmisher";
        alignment: Alignment;
    }

    interface ArmyDetailsSource extends Required<ActorDetailsSource> {
        strongSave: string;
        weakSave: string;
        description: string;
    }

    interface ArmySystemData extends Omit<ArmySystemSource, "attributes">, ActorSystemData {
        attributes: ArmyAttributes;
        traits: ArmyTraits;
        perception: Pick<PerceptionTraceData, "senses">;
        details: ArmyDetails;
        resources: ArmyResourcesData;
        saves: ArmySystemSource["saves"] & {
            strongSave: "maneuver" | "morale";
        };
    }

    interface ArmyAttributesSource extends ActorAttributesSource {
        immunities?: never;
        weaknesses?: never;
        resistances?: never;

        hp: ArmyHitPointsSource;
        ac: never;
    }

    interface ArmyAttributes
        extends Omit<ArmyAttributesSource, "immunities" | "weaknesses" | "resistances">,
            ActorAttributes {
        ac: never;
        hp: ArmyHitPoints;
    }

    interface ArmyHitPointsSource extends Required<BaseHitPointsSource> {
        /** Typically half the army's hit points, armies that can't be feared have a threshold of 0 instead */
        routThreshold: number;
    }

    interface ArmyHitPoints extends ArmyHitPointsSource, ActorHitPoints {
        negativeHealing: boolean;
        unrecoverable: number;
    }

    interface ArmyResourcesSource {
        /** How often this army can use ranged attacks */
        ammunition: ValueAndMax;
        potions: ValueAndMaybeMax;
    }

    interface ArmyResourcesData extends ArmyResourcesSource {
        potions: ValueAndMax;
    }

    interface ArmyTraits
        extends Omit<ArmyTraitsSource, "size">,
            Required<ActorTraitsData<string>> {}

    interface ArmyDetails extends ArmyDetailsSource, ActorDetails {}

    class ArmyPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends ActorPF2e<TParent> {
        declare scouting: Statistic;
        declare maneuver: Statistic;
        declare morale: Statistic;
    }

    interface ArmyPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends ActorPF2e<TParent> {
        readonly _source: ArmySource;
        armorClass: StatisticDifficultyClass<ArmorStatistic>;
        system: ArmySystemData;

        get hitPoints(): HitPointsSummary;
    }
}
