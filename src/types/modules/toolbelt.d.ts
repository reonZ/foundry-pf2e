export {};

declare global {
    namespace toolbelt {
        namespace stances {
            type StanceData = {
                name: string;
                itemName: string;
                uuid: string;
                img: string;
                effectUUID: string;
                effectID: string | undefined;
                actionUUID: string;
                actionID: string;
            };
        }

        namespace heroActions {
            type HeroActionFlag = { uuid: string; name: string };
        }
    }

    class PF2eToolbeltModule extends Module {
        api: {
            actionable: {
                getActionMacro: (item: Maybe<ItemPF2e>) => Promise<Macro | null>;
            };
            stances: {
                canUseStances: (actor: CharacterPF2e) => boolean;
                getStances: (actor: CharacterPF2e) => toolbelt.stances.StanceData[];
                isValidStance: (stance: ItemPF2e) => stance is FeatPF2e<ActorPF2e>;
                toggleStance: (
                    actor: CharacterPF2e,
                    effectUUID: string,
                    force?: boolean
                ) => Promise<void>;
            };
            heroActions: {
                canTrade: () => boolean;
                discardHeroActions: (actor: CharacterPF2e, uuids: string[] | string) => void;
                drawHeroAction: () => Promise<
                    | {
                          uuid: string;
                          name: string | undefined;
                      }
                    | null
                    | undefined
                >;
                drawHeroActions: (actor: CharacterPF2e) => Promise<void>;
                getDeckTable: () => Promise<RollTable | undefined>;
                getHeroActionDetails: (uuid: string) => Promise<
                    | {
                          name: string;
                          description: string;
                      }
                    | undefined
                >;
                getHeroActions: (actor: CharacterPF2e) => toolbelt.heroActions.HeroActionFlag[];
                giveHeroActions: (actor: CharacterPF2e) => Promise<null | undefined>;
                removeHeroActions: () => Promise<void>;
                sendActionToChat: (actor: CharacterPF2e, uuid: string) => Promise<void>;
                tradeHeroAction: (actor: CharacterPF2e, app?: Application) => Promise<void>;
                useHeroAction: (actor: CharacterPF2e, uuid: string) => Promise<void>;
                usesCountVariant: () => boolean;
            };
            identify: {
                openTracker: (item?: ItemPF2e) => void;
                requestIdentify: (item: ItemPF2e, skipNotify?: boolean) => void;
            };
        };
    }
}
