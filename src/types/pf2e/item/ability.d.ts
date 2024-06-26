export {};

declare global {
    type ActionCategory = "familiar" | "interaction" | "defensive" | "offensive";
    type ActionTrait = string;

    type AbilitySource = BaseItemSourcePF2e<"action", AbilitySystemSource>;

    interface AbilitySystemSource extends ItemSystemSource {
        traits: AbilityTraitsSource;
        actionType: {
            value: ActionType;
        };
        actions: {
            value: OneToThree | null;
        };
        category: ActionCategory | null;
        deathNote: boolean;
        frequency?: FrequencySource;

        /** A self-applied effect for simple actions */
        selfEffect?: SelfEffectReferenceSource | null;

        level?: never;
    }

    interface AbilityTraitsSource extends ItemTraitsNoRarity<ActionTrait> {
        toggles?: { mindshift?: { selected?: boolean } | null };
    }

    interface SelfEffectReferenceSource {
        uuid: ItemUUID;
        name: string;
    }

    interface AbilitySystemData
        extends Omit<AbilitySystemSource, "description">,
            Omit<ItemSystemData, "level"> {
        traits: AbilityTraits;
        frequency?: Frequency;
        /** A self-applied effect for simple actions */
        selfEffect: SelfEffectReference | null;
    }

    interface AbilityTraits extends AbilityTraitsSource {
        toggles: AbilityTraitToggles;
    }

    interface SelfEffectReference extends SelfEffectReferenceSource {
        img?: Maybe<ImageFilePath>;
    }

    class AbilityTraitToggles {
        mindshift: { selected: boolean } | null;

        getSheetData(): TraitToggleViewData[];

        update({ trait, selected }: { trait: "mindshift"; selected: boolean }): Promise<boolean>;
    }

    interface TraitToggleViewData {
        trait: string;
        selected: boolean;
        icon: string;
        classes: string;
        tooltip: string;
    }

    class AbilityItemPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {
        get traits(): Set<ActionTrait>;
        get actionCost(): ActionCost | null;
        get frequency(): Frequency | null;
    }

    interface AbilityItemPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: AbilitySource;
        system: AbilitySystemData;
    }
}
