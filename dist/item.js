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
exports.isOwnedItem = exports.hasItemWithSourceId = exports.getSourceId = exports.getItemWithSourceId = exports.getEquippedHandwraps = exports.getActionAnnotation = exports.changeCarryType = exports.actorItems = exports.HANDWRAPS_SLUG = exports.BANDS_OF_FORCE_SLUGS = void 0;
const pf2e_1 = require("./pf2e");
const R = __importStar(require("remeda"));
const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
exports.HANDWRAPS_SLUG = HANDWRAPS_SLUG;
const BANDS_OF_FORCE_SLUGS = [
    "bands-of-force",
    "bands-of-force-greater",
    "bands-of-force-major",
];
exports.BANDS_OF_FORCE_SLUGS = BANDS_OF_FORCE_SLUGS;
function getEquippedHandwraps(actor) {
    return actor.itemTypes.weapon.find((weapon) => {
        const { category, slug, equipped, identification } = weapon._source.system;
        const { carryType, invested, inSlot } = equipped;
        return (category === "unarmed" &&
            carryType === "worn" &&
            inSlot &&
            invested &&
            identification.status === "identified" &&
            slug === HANDWRAPS_SLUG);
    });
}
exports.getEquippedHandwraps = getEquippedHandwraps;
function getCarryTypeActionData(item, annotation, action = "interact") {
    switch (annotation) {
        case "draw":
            return [1, "held"];
        case "pick-up":
            return [1, "held"];
        case "retrieve": {
            const { container } = item;
            if (container?.isHeld)
                return [1, "held"];
            const usage = container?.system.usage;
            const actionCost = usage?.type === "held" || usage?.where === "backpack" ? 2 : 1;
            return [actionCost, "held"];
        }
        case "grip":
            return [action === "interact" ? 1 : 0, "held"];
        case "sheathe":
            return [1, "worn"];
        case "modular":
            return [1, null];
        case "drop":
            return [0, "dropped"];
        case "tower-shield": {
            const cost = action === "take-cover" ? 1 : 0;
            return [cost, null];
        }
        default:
            return [1, null];
    }
}
function getAnnotationLabel(annotation, hands) {
    if (!annotation)
        return null;
    const fullAnnotation = ["draw", "pick-up", "retrieve"].includes(annotation)
        ? `${annotation}${hands}H`
        : ["grip", "sheathe", "modular", "drop"].includes(annotation)
            ? annotation
            : null;
    return fullAnnotation ? game.pf2e.system.sluggify(fullAnnotation, { camel: "bactrian" }) : null;
}
async function changeCarryType(actor, item, handsHeld, annotation, action = "interact") {
    const [actionCost, carryType] = getCarryTypeActionData(item, annotation, action);
    if (!carryType)
        return;
    await actor.changeCarryType(item, { carryType, handsHeld });
    if (!game.combat)
        return;
    const templates = {
        flavor: "./systems/pf2e/templates/chat/action/flavor.hbs",
        content: "./systems/pf2e/templates/chat/action/content.hbs",
    };
    const sluggify = game.pf2e.system.sluggify;
    const actionKey = sluggify(action, { camel: "bactrian" });
    const annotationKey = annotation ? sluggify(annotation, { camel: "bactrian" }) : null;
    const fullAnnotationKey = getAnnotationLabel(annotation, handsHeld);
    const flavorAction = {
        title: `PF2E.Actions.${actionKey}.Title`,
        subtitle: fullAnnotationKey ? `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Title` : null,
        glyph: (0, pf2e_1.getActionGlyph)(actionCost),
    };
    const [traits, message] = action === "raise-a-shield"
        ? [[], `PF2E.Actions.${actionKey}.Content`]
        : ["take-cover", "end-cover"].includes(action)
            ? [[], `PF2E.Actions.${actionKey}.${annotationKey}.Description`]
            : [
                [(0, pf2e_1.traitSlugToObject)("manipulate", CONFIG.PF2E.actionTraits)],
                `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Description`,
            ];
    const flavor = await renderTemplate(templates.flavor, { action: flavorAction, traits });
    const content = await renderTemplate(templates.content, {
        imgPath: item.img,
        message: game.i18n.format(message, {
            actor: actor.name,
            weapon: item.name,
            // shield: item.shield?.name ?? item.name,
            // damageType: game.i18n.localize(`PF2E.Damage.RollFlavor.${selection}`),
        }),
    });
    const token = actor.getActiveTokens(false, true).shift();
    await getDocumentClass("ChatMessage").create({
        content,
        speaker: ChatMessage.getSpeaker({ actor, token }),
        flavor,
        type: CONST.CHAT_MESSAGE_STYLES.EMOTE,
    });
}
exports.changeCarryType = changeCarryType;
function getActionAnnotation(item) {
    if (item.isEquipped)
        return;
    return item.carryType === "dropped" ? "pick-up" : item.isStowed ? "retrieve" : "draw";
}
exports.getActionAnnotation = getActionAnnotation;
function isOwnedItem(item) {
    return !!item?.actor;
}
exports.isOwnedItem = isOwnedItem;
const EXCLUDED_TYPES = ["affliction"];
function* actorItems(actor, type) {
    const types = Array.isArray(type)
        ? type
        : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);
    for (const type of types) {
        if (EXCLUDED_TYPES.includes(type))
            continue;
        for (const item of actor.itemTypes[type]) {
            yield item;
        }
    }
}
exports.actorItems = actorItems;
function getSourceId(item) {
    return item.sourceId ?? item._stats.compendiumSource;
}
exports.getSourceId = getSourceId;
function hasItemWithSourceId(actor, uuid, type) {
    const uuids = Array.isArray(uuid) ? uuid : [uuid];
    for (const item of actorItems(actor, type)) {
        const sourceId = getSourceId(item);
        if (sourceId && uuids.includes(sourceId))
            return true;
    }
    return false;
}
exports.hasItemWithSourceId = hasItemWithSourceId;
function getItemWithSourceId(actor, uuid, type) {
    for (const item of actorItems(actor, type)) {
        const sourceId = getSourceId(item);
        if (sourceId && uuid.includes(sourceId))
            return item;
    }
    return null;
}
exports.getItemWithSourceId = getItemWithSourceId;
