import { ACTOR_TYPES } from "./actor";
import { objectHasKey, splitListString } from "./misc";
import * as R from "remeda";

const USER_VISIBILITIES = new Set(["all", "owner", "gm", "none"] as const);

const actorTypes: (ActorType | "creature")[] = [...ACTOR_TYPES];

function traitSlugToObject(
    trait: string,
    dictionary: Record<string, string | undefined>
): TraitViewData {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject: TraitViewData = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }

    return traitObject;
}

function getSelectedActors(options: GetSelectedActorsOptions = {}): ActorPF2e[] {
    const { include = actorTypes, exclude = [], assignedFallback = false } = options;
    const actors = R.unique(
        game.user
            .getActiveTokens()
            .flatMap((t) =>
                t.actor &&
                (include.length === 0 || t.actor.isOfType(...include)) &&
                (exclude.length === 0 || !t.actor.isOfType(...exclude))
                    ? t.actor
                    : []
            )
    );
    const assigned = game.user.character;
    if (actors.length > 0 || !assignedFallback || !assigned) {
        return actors;
    }

    if (
        (include.length === 0 || assigned.isOfType(...include)) &&
        (exclude.length === 0 || !assigned.isOfType(...exclude))
    ) {
        return [assigned];
    }

    return [];
}

function isRelevantEvent(
    event: Maybe<JQuery.TriggeredEvent | Event>
): event is MouseEvent | TouchEvent | KeyboardEvent | WheelEvent | JQuery.TriggeredEvent {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}

/** Set roll mode and dialog skipping from a user's input */
function eventToRollParams(
    event: Maybe<JQuery.TriggeredEvent | Event>,
    rollType: { type: "check" | "damage" }
): ParamsFromEvent {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !game.user.settings[key];
    if (!isRelevantEvent(event)) return { skipDialog: skipDefault };

    const params: ParamsFromEvent = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }

    return params;
}

function eventToRollMode(event: Maybe<Event>): RollMode | "roll" {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey)) return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}

function parseInlineParams(
    paramString: string,
    options: { first?: string } = {}
): Record<string, string | undefined> | null {
    const parts = splitListString(paramString, { delimiter: "|" });
    const result = parts.reduce((result, part, idx) => {
        if (idx === 0 && options.first && !part.includes(":")) {
            result[options.first] = part.trim();
            return result;
        }

        const colonIdx = part.indexOf(":");
        const portions =
            colonIdx >= 0 ? [part.slice(0, colonIdx), part.slice(colonIdx + 1)] : [part, ""];
        result[portions[0]] = portions[1];

        return result;
    }, {} as Record<string, string | undefined>);

    return result;
}

class UUIDUtils {
    /** Retrieve multiple documents by UUID */
    static async fromUUIDs(
        uuids: ActorUUID[],
        options?: { relative?: Maybe<ClientDocument> }
    ): Promise<ActorPF2e[]>;
    static async fromUUIDs(
        uuids: ItemUUID[],
        options?: { relative?: Maybe<ClientDocument> }
    ): Promise<ItemPF2e[]>;
    static async fromUUIDs(
        uuids: string[],
        options?: { relative?: Maybe<ClientDocument> }
    ): Promise<ClientDocument[]>;
    static async fromUUIDs(
        uuids: string[],
        options?: { relative?: Maybe<ClientDocument> }
    ): Promise<ClientDocument[]> {
        const resolvedUUIDs = R.unique(uuids).flatMap(
            (u) => foundry.utils.parseUuid(u, options).uuid ?? []
        );

        // These can't be retrieved via `fromUuidSync`: separate and retrieve directly via `fromUuid`
        const packEmbeddedLinks = resolvedUUIDs.filter((u) => {
            const parsed = foundry.utils.parseUuid(u, options);
            return parsed.collection instanceof CompendiumCollection && parsed.embedded.length > 0;
        });
        const packEmbeddedDocs = (
            await Promise.all(packEmbeddedLinks.map((u) => fromUuid(u)))
        ).filter(R.isTruthy);

        const documentsAndIndexData = resolvedUUIDs
            .filter((u) => !packEmbeddedLinks.includes(u))
            .map((u) => fromUuidSync(u))
            .filter(R.isTruthy);

        const worldDocsAndCacheHits = documentsAndIndexData.filter(
            (d): d is ClientDocument => d instanceof foundry.abstract.Document
        );
        const indexEntries = documentsAndIndexData.filter(
            (d): d is CompendiumIndexData => !(d instanceof foundry.abstract.Document)
        );
        const packs = R.unique(indexEntries.flatMap((e) => game.packs.get(e.pack ?? "") ?? []));
        const packDocs = (
            await Promise.all(
                packs.map(async (pack) => {
                    const ids = indexEntries
                        .filter((e) => e.pack === pack.metadata.id)
                        .map((e) => e._id);
                    return pack.getDocuments({ _id__in: ids });
                })
            )
        ).flat();

        return R.sortBy([...packEmbeddedDocs, ...worldDocsAndCacheHits, ...packDocs], (d) =>
            uuids.indexOf(d.uuid)
        );
    }

    static isItemUUID(uuid: unknown, options: { embedded: true }): uuid is EmbeddedItemUUID;
    static isItemUUID(
        uuid: unknown,
        options: { embedded: false }
    ): uuid is WorldItemUUID | CompendiumItemUUID;
    static isItemUUID(uuid: unknown, options?: { embedded?: boolean }): uuid is ItemUUID;
    static isItemUUID(uuid: unknown, options: { embedded?: boolean } = {}): uuid is ItemUUID {
        if (typeof uuid !== "string") return false;
        try {
            const parseResult = foundry.utils.parseUuid(uuid);
            const isEmbedded = parseResult.embedded.length > 0;
            return (
                parseResult.type === "Item" &&
                (options.embedded === true
                    ? isEmbedded
                    : options.embedded === false
                    ? !isEmbedded
                    : true)
            );
        } catch {
            return false;
        }
    }

    static isCompendiumUUID(uuid: unknown, docType: "Actor"): uuid is CompendiumActorUUID;
    static isCompendiumUUID(uuid: unknown, docType: "Item"): uuid is CompendiumItemUUID;
    static isCompendiumUUID<TDocType extends DocumentType>(
        uuid: unknown,
        docType?: TDocType
    ): uuid is CompendiumUUID;
    static isCompendiumUUID<TDocType extends DocumentType>(
        uuid: unknown,
        docType?: TDocType
    ): boolean {
        if (typeof uuid !== "string") return false;
        try {
            const parseResult = foundry.utils.parseUuid(uuid);
            const isCompendiumUUID = parseResult.collection instanceof CompendiumCollection;
            return isCompendiumUUID && (docType ? uuid.includes(`.${docType}.`) : true);
        } catch {
            return false;
        }
    }

    static isTokenUUID(uuid: unknown): uuid is TokenDocumentUUID {
        if (typeof uuid !== "string") return false;
        try {
            const parsed = foundry.utils.parseUuid(uuid);
            return parsed.documentType === "Scene" && parsed.embedded[0] === "Token";
        } catch {
            return false;
        }
    }
}

type ParamsFromEvent = { skipDialog: boolean; rollMode?: RollMode | "roll" };

interface GetSelectedActorsOptions {
    /** Actor types that should be included (defaults to all) */
    include?: (ActorType | "creature")[];
    /** Actor types that should be excluded (defaults to none) */
    exclude?: (ActorType | "creature")[];
    /** Given no qualifying actor is selected, fall back to the user's assigned character if it also qualifies. */
    assignedFallback?: boolean;
}

export {
    USER_VISIBILITIES,
    UUIDUtils,
    eventToRollMode,
    eventToRollParams,
    getSelectedActors,
    parseInlineParams,
    traitSlugToObject,
};
