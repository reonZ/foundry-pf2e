export {};

declare global {
    type TreasureSource = BasePhysicalItemSource<"treasure", TreasureSystemSource>;

    interface TreasureSystemSource extends PhysicalSystemSource {
        traits: PhysicalItemTraits<never>;
        stackGroup: "coins" | "gems" | null;

        apex?: never;
        subitems?: never;
        usage?: never;
    }

    interface TreasureSystemData extends PhysicalSystemData {
        traits: PhysicalItemTraits<never>;
        equipped: TreasureEquippedData;
        /** Treasure need only be on one's person. */
        usage: CarriedUsage;

        stackGroup: "coins" | "gems" | null;

        apex?: never;
        subitems?: never;
    }

    interface TreasureEquippedData extends EquippedData {
        invested?: never;
    }

    interface TreasureSystemSource extends PhysicalSystemSource {
        traits: PhysicalItemTraits<never>;
        stackGroup: "coins" | "gems" | null;

        apex?: never;
        subitems?: never;
        usage?: never;
    }

    interface TreasureSystemData extends PhysicalSystemData {
        traits: PhysicalItemTraits<never>;
        equipped: TreasureEquippedData;
        /** Treasure need only be on one's person. */
        usage: CarriedUsage;

        stackGroup: "coins" | "gems" | null;

        apex?: never;
        subitems?: never;
    }

    interface TreasureEquippedData extends EquippedData {
        invested?: never;
    }
    class TreasurePF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {}

    interface TreasurePF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: TreasureSource;
        system: TreasureSystemData;
    }
}
