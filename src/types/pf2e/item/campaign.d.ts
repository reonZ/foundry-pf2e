export {};

declare global {
    class CampaignFeaturePF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {}

    interface CampaignFeaturePF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: CampaignFeatureSource;
        system: CampaignFeatureSystemData;
    }

    type CampaignFeatureSource = BaseItemSourcePF2e<"campaignFeature", CampaignFeatureSystemSource>;

    interface PrerequisiteTagData {
        value: string;
    }

    type BehaviorType = "feat" | "feature" | "activity";
    type KingmakerCategory =
        | "army-tactic"
        | "army-war-action"
        | "kingdom-feat"
        | "kingdom-feature"
        | "kingdom-activity";
    type KingmakerTrait = string;

    interface CampaignFeatureSystemSource extends ItemSystemSource {
        campaign: "kingmaker";
        /** The category of feat or feature of this item */
        category: KingmakerCategory;
        /** Level only exists for feat and feature types */
        level?: { value: number };
        traits: KingmakerTraits;
        actionType: {
            value: ActionType;
        };
        actions: {
            value: OneToThree | null;
        };
        prerequisites: {
            value: PrerequisiteTagData[];
        };
        location: string | null;
        frequency?: FrequencySource;
    }

    interface CampaignFeatureSystemData
        extends Omit<CampaignFeatureSystemSource, "description">,
            Omit<ItemSystemData, "traits"> {
        frequency?: Frequency;
    }

    type KingmakerTraits = ItemTraits<KingmakerTrait>;
}
