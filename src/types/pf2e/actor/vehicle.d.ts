export {};

declare global {
    /** The stored source data of a vehicle actor */
    type VehicleSource = BaseActorSourcePF2e<"vehicle", VehicleSystemSource>;

    interface VehicleSystemSource extends ActorSystemSource {
        attributes: VehicleAttributesSource;
        details: VehicleDetailsSource;
        saves: {
            fortitude: VehicleFortitudeSaveData;
        };

        traits: VehicleTraitsSource;
    }

    interface VehicleAttributesSource extends ActorAttributesSource {
        ac: { value: number };
        hardness: number;
        immunities: ImmunitySource[];
    }

    interface VehicleDetailsSource extends ActorDetailsSource {
        description: string;
        level: {
            value: number;
        };
        alliance: null;
        price: number;
        space: {
            long: number;
            wide: number;
            high: number;
        };
        crew: string;
        passengers: string;
        pilotingCheck: string;
        AC: number;
        speed: string;
        /** Information concerning the publication from which this actor originates */
        publication: PublicationData;
    }

    type VehicleTrait = "magical" | "artifact" | "clockwork" | "teleportation";

    interface VehicleTraitsSource extends ActorTraitsSource<VehicleTrait> {
        rarity: Rarity;
        size: { value: Size };
        languages?: never;
    }

    /** The system-level data of vehicle actors. */
    interface VehicleSystemData extends VehicleSystemSource, Omit<ActorSystemData, "details"> {
        attributes: VehicleAttributes;
        traits: VehicleTraits;
    }

    interface VehicleAttributes
        extends Omit<VehicleAttributesSource, AttributesSourceOmission>,
            ActorAttributes {
        ac: ArmorClassTraceData;
        hp: VehicleHitPoints;
        initiative?: never;
        shield?: never;
        emitsSound: boolean | "encounter";
    }
    type AttributesSourceOmission = "immunities" | "weaknesses" | "resistances";

    interface VehicleHitPoints extends ActorHitPoints {
        brokenThreshold: number;
    }

    interface VehicleFortitudeSaveData extends StatisticTraceData {
        saveDetail: string;
    }

    interface VehicleTraits extends VehicleTraitsSource {
        size: ActorSizePF2e;
    }

    interface TokenDimensions {
        width: number;
        height: number;
    }

    class VehiclePF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends ActorPF2e<TParent> {}

    interface VehiclePF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends ActorPF2e<TParent> {
        readonly _source: VehicleSource;
        system: VehicleSystemData;

        get hitPoints(): HitPointsSummary;

        saves: { fortitude: Statistic };
    }
}
