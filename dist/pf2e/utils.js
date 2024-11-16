"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traitSlugToObject = exports.parseInlineParams = exports.getSelectedActors = exports.eventToRollParams = exports.eventToRollMode = exports.UUIDUtils = exports.USER_VISIBILITIES = void 0;
const actor_1 = require("./actor");
const misc_1 = require("./misc");
const R = __importStar(require("remeda"));
const USER_VISIBILITIES = new Set(["all", "owner", "gm", "none"]);
exports.USER_VISIBILITIES = USER_VISIBILITIES;
const actorTypes = [...actor_1.ACTOR_TYPES];
function traitSlugToObject(trait, dictionary) {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if ((0, misc_1.objectHasKey)(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }
    return traitObject;
}
exports.traitSlugToObject = traitSlugToObject;
function getSelectedActors(options = {}) {
    const { include = actorTypes, exclude = [], assignedFallback = false } = options;
    const actors = R.unique(game.user
        .getActiveTokens()
        .flatMap((t) => t.actor &&
        (include.length === 0 || t.actor.isOfType(...include)) &&
        (exclude.length === 0 || !t.actor.isOfType(...exclude))
        ? t.actor
        : []));
    const assigned = game.user.character;
    if (actors.length > 0 || !assignedFallback || !assigned) {
        return actors;
    }
    if ((include.length === 0 || assigned.isOfType(...include)) &&
        (exclude.length === 0 || !assigned.isOfType(...exclude))) {
        return [assigned];
    }
    return [];
}
exports.getSelectedActors = getSelectedActors;
function isRelevantEvent(event) {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}
/** Set roll mode and dialog skipping from a user's input */
function eventToRollParams(event, rollType) {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !game.user.settings[key];
    if (!isRelevantEvent(event))
        return { skipDialog: skipDefault };
    const params = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }
    return params;
}
exports.eventToRollParams = eventToRollParams;
function eventToRollMode(event) {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey))
        return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}
exports.eventToRollMode = eventToRollMode;
function parseInlineParams(paramString, options = {}) {
    const parts = (0, misc_1.splitListString)(paramString, { delimiter: "|" });
    const result = parts.reduce((result, part, idx) => {
        if (idx === 0 && options.first && !part.includes(":")) {
            result[options.first] = part.trim();
            return result;
        }
        const colonIdx = part.indexOf(":");
        const portions = colonIdx >= 0 ? [part.slice(0, colonIdx), part.slice(colonIdx + 1)] : [part, ""];
        result[portions[0]] = portions[1];
        return result;
    }, {});
    return result;
}
exports.parseInlineParams = parseInlineParams;
class UUIDUtils {
    static async fromUUIDs(uuids, options) {
        const resolvedUUIDs = R.unique(uuids).flatMap((u) => foundry.utils.parseUuid(u, options).uuid ?? []);
        // These can't be retrieved via `fromUuidSync`: separate and retrieve directly via `fromUuid`
        const packEmbeddedLinks = resolvedUUIDs.filter((u) => {
            const parsed = foundry.utils.parseUuid(u, options);
            return parsed.collection instanceof CompendiumCollection && parsed.embedded.length > 0;
        });
        const packEmbeddedDocs = (await Promise.all(packEmbeddedLinks.map((u) => fromUuid(u)))).filter(R.isTruthy);
        const documentsAndIndexData = resolvedUUIDs
            .filter((u) => !packEmbeddedLinks.includes(u))
            .map((u) => fromUuidSync(u))
            .filter(R.isTruthy);
        const worldDocsAndCacheHits = documentsAndIndexData.filter((d) => d instanceof foundry.abstract.Document);
        const indexEntries = documentsAndIndexData.filter((d) => !(d instanceof foundry.abstract.Document));
        const packs = R.unique(indexEntries.flatMap((e) => game.packs.get(e.pack ?? "") ?? []));
        const packDocs = (await Promise.all(packs.map(async (pack) => {
            const ids = indexEntries
                .filter((e) => e.pack === pack.metadata.id)
                .map((e) => e._id);
            return pack.getDocuments({ _id__in: ids });
        }))).flat();
        return R.sortBy([...packEmbeddedDocs, ...worldDocsAndCacheHits, ...packDocs], (d) => uuids.indexOf(d.uuid));
    }
    static isItemUUID(uuid, options = {}) {
        if (typeof uuid !== "string")
            return false;
        try {
            const parseResult = foundry.utils.parseUuid(uuid);
            const isEmbedded = parseResult.embedded.length > 0;
            return (parseResult.type === "Item" &&
                (options.embedded === true
                    ? isEmbedded
                    : options.embedded === false
                        ? !isEmbedded
                        : true));
        }
        catch {
            return false;
        }
    }
    static isCompendiumUUID(uuid, docType) {
        if (typeof uuid !== "string")
            return false;
        try {
            const parseResult = foundry.utils.parseUuid(uuid);
            const isCompendiumUUID = parseResult.collection instanceof CompendiumCollection;
            return isCompendiumUUID && (docType ? uuid.includes(`.${docType}.`) : true);
        }
        catch {
            return false;
        }
    }
    static isTokenUUID(uuid) {
        if (typeof uuid !== "string")
            return false;
        try {
            const parsed = foundry.utils.parseUuid(uuid);
            return parsed.documentType === "Scene" && parsed.embedded[0] === "Token";
        }
        catch {
            return false;
        }
    }
}
exports.UUIDUtils = UUIDUtils;
