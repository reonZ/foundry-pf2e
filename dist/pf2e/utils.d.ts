/// <reference types="jquery" />
declare const USER_VISIBILITIES: Set<"all" | "none" | "owner" | "gm">;
declare function traitSlugToObject(trait: string, dictionary: Record<string, string | undefined>): TraitViewData;
declare function getSelectedActors(options?: GetSelectedActorsOptions): ActorPF2e[];
/** Set roll mode and dialog skipping from a user's input */
declare function eventToRollParams(event: Maybe<JQuery.TriggeredEvent | Event>, rollType: {
    type: "check" | "damage";
}): ParamsFromEvent;
declare function eventToRollMode(event: Maybe<Event>): RollMode | "roll";
declare function parseInlineParams(paramString: string, options?: {
    first?: string;
}): Record<string, string | undefined> | null;
declare class UUIDUtils {
    /** Retrieve multiple documents by UUID */
    static fromUUIDs(uuids: ActorUUID[], options?: {
        relative?: Maybe<ClientDocument>;
    }): Promise<ActorPF2e[]>;
    static fromUUIDs(uuids: ItemUUID[], options?: {
        relative?: Maybe<ClientDocument>;
    }): Promise<ItemPF2e[]>;
    static fromUUIDs(uuids: string[], options?: {
        relative?: Maybe<ClientDocument>;
    }): Promise<ClientDocument[]>;
    static isItemUUID(uuid: unknown, options: {
        embedded: true;
    }): uuid is EmbeddedItemUUID;
    static isItemUUID(uuid: unknown, options: {
        embedded: false;
    }): uuid is WorldItemUUID | CompendiumItemUUID;
    static isItemUUID(uuid: unknown, options?: {
        embedded?: boolean;
    }): uuid is ItemUUID;
    static isCompendiumUUID(uuid: unknown, docType: "Actor"): uuid is CompendiumActorUUID;
    static isCompendiumUUID(uuid: unknown, docType: "Item"): uuid is CompendiumItemUUID;
    static isCompendiumUUID<TDocType extends DocumentType>(uuid: unknown, docType?: TDocType): uuid is CompendiumUUID;
    static isTokenUUID(uuid: unknown): uuid is TokenDocumentUUID;
}
type ParamsFromEvent = {
    skipDialog: boolean;
    rollMode?: RollMode | "roll";
};
interface GetSelectedActorsOptions {
    /** Actor types that should be included (defaults to all) */
    include?: (ActorType | "creature")[];
    /** Actor types that should be excluded (defaults to none) */
    exclude?: (ActorType | "creature")[];
    /** Given no qualifying actor is selected, fall back to the user's assigned character if it also qualifies. */
    assignedFallback?: boolean;
}
export { USER_VISIBILITIES, UUIDUtils, eventToRollMode, eventToRollParams, getSelectedActors, parseInlineParams, traitSlugToObject, };
