declare const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
declare const BANDS_OF_FORCE_SLUGS: readonly ["bands-of-force", "bands-of-force-greater", "bands-of-force-major"];
declare function getEquippedHandwraps<T extends ActorPF2e>(actor: T): WeaponPF2e<T> | undefined;
declare function changeCarryType(actor: CreaturePF2e, item: PhysicalItemPF2e<CreaturePF2e>, handsHeld: ZeroToTwo, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): Promise<void>;
declare function getActionAnnotation(item: PhysicalItemPF2e): AuxiliaryActionPurpose;
declare function isOwnedItem(item: Maybe<ItemPF2e>): item is ItemPF2e<ActorPF2e>;
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function hasItemWithSourceId(actor: ActorPF2e, uuid: string | string[], type?: ItemType | ItemType[]): boolean;
declare function getItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType | TType[]): ItemInstances<TActor>[TType] | null;
declare function getChoiceSetSelection<T extends any = string>(item: ItemPF2e, { option, flag }?: {
    option?: string;
    flag?: string;
}): T | undefined;
export { BANDS_OF_FORCE_SLUGS, HANDWRAPS_SLUG, actorItems, changeCarryType, getActionAnnotation, getChoiceSetSelection, getEquippedHandwraps, getItemWithSourceId, hasItemWithSourceId, isOwnedItem, };
