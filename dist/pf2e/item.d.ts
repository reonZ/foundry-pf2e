/// <reference types="jquery" />
declare const ITEM_CARRY_TYPES: readonly ["attached", "dropped", "held", "stowed", "worn"];
declare const PHYSICAL_ITEM_TYPES: Set<"armor" | "backpack" | "book" | "consumable" | "equipment" | "shield" | "treasure" | "weapon">;
declare function detachSubitem(subitem: PhysicalItemPF2e, skipConfirm: boolean): Promise<void>;
declare function consumeItem(event: Event, item: ConsumablePF2e): Promise<void | ConsumablePF2e<ActorPF2e<TokenDocumentPF2e<ScenePF2e | null> | null> | null> | null>;
declare function hasFreePropertySlot(item: WeaponPF2e): boolean;
/** Determine in a type-safe way whether an `ItemPF2e` or `ItemSourcePF2e` is among certain types */
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(item: ItemOrSource, ...types: TType[]): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(item: ItemOrSource, ...types: TType[]): item is TType extends "physical" ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"] : TType extends ItemType ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"] : never;
declare function itemIsOfType<TParent extends ActorPF2e | null>(item: ItemOrSource, type: "physical"): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
declare function calculateItemPrice(item: PhysicalItemPF2e, quantity?: number, ratio?: number): CoinsPF2e;
declare function createSelfEffectMessage(item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>, rollMode?: RollMode | "roll"): Promise<ChatMessagePF2e | null>;
declare function getActionImg(item: FeatPF2e | AbilityItemPF2e, itemImgFallback?: boolean): ImageFilePath;
declare function unownedItemtoMessage(actor: ActorPF2e, item: ItemPF2e, event?: Maybe<Event | JQuery.TriggeredEvent>, options?: {
    rollMode?: RollMode | "roll";
    create?: boolean;
    data?: Record<string, unknown>;
}): Promise<ChatMessagePF2e | undefined>;
type ItemOrSource = PreCreate<ItemSourcePF2e> | ItemPF2e;
export { calculateItemPrice, consumeItem, createSelfEffectMessage, detachSubitem, getActionImg, hasFreePropertySlot, ITEM_CARRY_TYPES, itemIsOfType, PHYSICAL_ITEM_TYPES, unownedItemtoMessage, };
