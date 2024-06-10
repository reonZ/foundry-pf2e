declare function changeCarryType(actor: CreaturePF2e, item: PhysicalItemPF2e<CreaturePF2e>, handsHeld: ZeroToTwo, annotation: NonNullable<AuxiliaryActionPurpose> | null, action?: AuxiliaryActionType): Promise<void>;
declare function getActionAnnotation(item: PhysicalItemPF2e): AuxiliaryActionPurpose;
declare function isOwnedItem(item: Maybe<ItemPF2e>): item is ItemPF2e<ActorPF2e>;
declare function hasItemWithSourceId(actor: ActorPF2e, uuid: string, types?: ItemType | ItemType[]): boolean;
export { changeCarryType, getActionAnnotation, hasItemWithSourceId, isOwnedItem };
