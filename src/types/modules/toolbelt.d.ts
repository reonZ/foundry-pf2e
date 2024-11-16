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

        type settings = {
            targetHelper: {
                enabled: boolean;
                addTargets: boolean;
                smallButtons: boolean;
            };
        };
    }

    class PF2eToolbeltModule extends Module {
        api: {
            actionable: {
                getActionMacro: (item: Maybe<ItemPF2e>) => Promise<Macro | null>;
            };
            betterMerchant: {
                testItem: (
                    actor: LootPF2e,
                    item: PhysicalItemPF2e,
                    type: "buy" | "sell",
                    quantity?: number
                ) =>
                    | {
                          price: CoinsPF2e;
                          filter: object;
                      }
                    | undefined;
                compareItemWithFilter: (
                    item: PhysicalItemPF2e,
                    filter: Partial<EquipmentFilters>
                ) => boolean;
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
            share: {
                getMaster: (
                    actor: ActorPF2e
                ) => CharacterPF2e<TokenDocumentPF2e<ScenePF2e | null> | null> | undefined;
                getMasterAndConfig: (actor: ActorPF2e) =>
                    | {
                          master: CharacterPF2e<TokenDocumentPF2e<ScenePF2e | null> | null>;
                          config: object;
                      }
                    | undefined;
                getSlaves: (
                    actor: ActorPF2e,
                    withConfig?: "armor" | "weapon" | "turn" | "skills" | "health" | "hero"
                ) => (CharacterPF2e | NPCPF2e)[];
                isValidSlave: (
                    actor: FoundryDocument | CompendiumIndexData
                ) => actor is CharacterPF2e | NPCPF2e;
                isValidMaster: (
                    actor: ActorPF2e | null | undefined,
                    id?: string
                ) => actor is CharacterPF2e;
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
        };
    }
}
