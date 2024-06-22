"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemIsOfType = exports.hasFreePropertySlot = exports.getActionImg = exports.detachSubitem = exports.createSelfEffectMessage = exports.consumeItem = exports.calculateItemPrice = exports.PHYSICAL_ITEM_TYPES = exports.ITEM_CARRY_TYPES = void 0;
const classes_1 = require("../classes");
const html_1 = require("../html");
const misc_1 = require("./misc");
const utils_1 = require("./utils");
const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"];
exports.ITEM_CARRY_TYPES = ITEM_CARRY_TYPES;
const PHYSICAL_ITEM_TYPES = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "shield",
    "treasure",
    "weapon",
]);
exports.PHYSICAL_ITEM_TYPES = PHYSICAL_ITEM_TYPES;
async function detachSubitem(subitem, skipConfirm) {
    const parentItem = subitem.parentItem;
    if (!parentItem)
        throw (0, misc_1.ErrorPF2e)("Subitem has no parent item");
    const localize = (0, misc_1.localizer)("PF2E.Item.Physical.Attach.Detach");
    const confirmed = skipConfirm ||
        (await Dialog.confirm({
            title: localize("Label"),
            content: (0, html_1.createHTMLElement)("p", {
                children: [localize("Prompt", { attachable: subitem.name })],
            }).outerHTML,
        }));
    if (confirmed) {
        const deletePromise = subitem.delete();
        const createPromise = (async () => {
            // Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
            const stack = subitem.isOfType("consumable")
                ? parentItem.actor?.inventory.findStackableItem(subitem.clone({ "system.equipped.carryType": "worn" }))
                : null;
            const keepId = !!parentItem.actor && !parentItem.actor.items.has(subitem.id);
            return (stack?.update({ "system.quantity": stack.quantity + 1 }) ??
                getDocumentClass("Item").create(foundry.utils.mergeObject(subitem.toObject(), {
                    "system.containerId": parentItem.system.containerId,
                }), { parent: parentItem.actor, keepId }));
        })();
        await Promise.all([deletePromise, createPromise]);
    }
}
exports.detachSubitem = detachSubitem;
async function consumeItem(event, item) {
    const uses = item.uses;
    if (uses.max && uses.value < 1)
        return null;
    if (["wand", "scroll"].includes(item.category) && item.system.spell) {
        return item.consume();
    }
    const actor = item.actor;
    // const multiUse = uses.max > 1;
    // const key = uses.value === 1 && multiUse ? "UseExhausted" : multiUse ? "UseMulti" : "UseSingle";
    const flags = {
        pf2e: {
            origin: {
                sourceId: item.sourceId,
                uuid: item.uuid,
                type: item.type,
            },
        },
    };
    const speaker = ChatMessage.getSpeaker({ actor });
    const contentHTML = (0, html_1.createHTMLElement)("div", {
        innerHTML: (await item.toMessage(event, { create: false })).content,
    }).firstElementChild;
    contentHTML.querySelector("button[data-action='consume']")?.remove();
    contentHTML.querySelector("footer")?.remove();
    const flavor = contentHTML.outerHTML;
    if (item.system.damage) {
        const DamageRoll = (0, classes_1.getDamageRollClass)();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);
        roll.toMessage({
            speaker,
            flavor,
            flags,
        });
    }
    else {
        ChatMessage.create({ speaker, content: flavor, flags });
    }
    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const quantityRemaining = item.quantity;
        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (quantityRemaining <= 1 && !isPreservedAmmo) {
            return item.delete();
        }
        else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    }
    else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}
exports.consumeItem = consumeItem;
function hasFreePropertySlot(item) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}
exports.hasFreePropertySlot = hasFreePropertySlot;
function itemIsOfType(item, ...types) {
    return (typeof item.name === "string" &&
        types.some((t) => t === "physical" ? (0, misc_1.setHasElement)(PHYSICAL_ITEM_TYPES, item.type) : item.type === t));
}
exports.itemIsOfType = itemIsOfType;
function calculateItemPrice(item, quantity = 1, ratio = 1) {
    const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
    return ratio === 1 ? coins : coins.scale(ratio);
}
exports.calculateItemPrice = calculateItemPrice;
async function createSelfEffectMessage(item, rollMode = "roll") {
    const ChatMessagePF2e = getDocumentClass("ChatMessage");
    const { actor, actionCost } = item;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const speaker = ChatMessagePF2e.getSpeaker({ actor, token });
    const flavor = await renderTemplate("systems/pf2e/templates/chat/action/flavor.hbs", {
        action: { title: item.name, glyph: (0, misc_1.getActionGlyph)(actionCost) },
        item,
        traits: item.system.traits.value.map((t) => (0, utils_1.traitSlugToObject)(t, CONFIG.PF2E.actionTraits)),
    });
    // Get a preview slice of the message
    const previewLength = 100;
    const descriptionPreview = (() => {
        if (item.actor.pack)
            return null;
        const tempDiv = document.createElement("div");
        const documentTypes = [...CONST.DOCUMENT_LINK_TYPES, "Compendium", "UUID"];
        const linkPattern = new RegExp(`@(${documentTypes.join("|")})\\[([^#\\]]+)(?:#([^\\]]+))?](?:{([^}]+)})?`, "g");
        tempDiv.innerHTML = item.description.replace(linkPattern, (_match, ...args) => args[3]);
        return tempDiv.innerText.slice(0, previewLength);
    })();
    const description = {
        full: descriptionPreview && descriptionPreview.length < previewLength
            ? item.description
            : null,
        preview: descriptionPreview,
    };
    const content = await renderTemplate("systems/pf2e/templates/chat/action/self-effect.hbs", {
        actor: item.actor,
        description,
    });
    const flags = {
        pf2e: { context: { type: "self-effect", item: item.id } },
    };
    const messageData = ChatMessagePF2e.applyRollMode({ speaker, flavor, content, flags }, rollMode);
    return (await ChatMessagePF2e.create(messageData)) ?? null;
}
exports.createSelfEffectMessage = createSelfEffectMessage;
function getActionImg(item) {
    const actionIcon = (0, misc_1.getActionIcon)(item.actionCost);
    const defaultIcon = getDocumentClass("Item").getDefaultArtwork(item._source).img;
    if (item.isOfType("action") && ![actionIcon, defaultIcon].includes(item.img)) {
        return item.img;
    }
    const selfEffect = item.system.selfEffect
        ? fromUuidSync(item.system.selfEffect.uuid)
        : undefined;
    return selfEffect?.img ?? actionIcon;
}
exports.getActionImg = getActionImg;
