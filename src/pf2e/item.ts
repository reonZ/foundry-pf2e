import { getDamageRollClass } from "../classes";
import { createHTMLElement } from "../html";
import { ErrorPF2e, localizer, setHasElement } from "./misc";

const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"] as const;

const PHYSICAL_ITEM_TYPES = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "shield",
    "treasure",
    "weapon",
] as const);

async function detachSubitem(subitem: PhysicalItemPF2e, skipConfirm: boolean): Promise<void> {
    const parentItem = subitem.parentItem;
    if (!parentItem) throw ErrorPF2e("Subitem has no parent item");

    const localize = localizer("PF2E.Item.Physical.Attach.Detach");
    const confirmed =
        skipConfirm ||
        (await Dialog.confirm({
            title: localize("Label"),
            content: createHTMLElement("p", {
                children: [localize("Prompt", { attachable: subitem.name })],
            }).outerHTML,
        }));

    if (confirmed) {
        const deletePromise = subitem.delete();
        const createPromise = (async (): Promise<unknown> => {
            // Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
            const stack = subitem.isOfType("consumable")
                ? parentItem.actor?.inventory.findStackableItem(
                      subitem.clone({ "system.equipped.carryType": "worn" })
                  )
                : null;
            const keepId = !!parentItem.actor && !parentItem.actor.items.has(subitem.id);
            return (
                stack?.update({ "system.quantity": stack.quantity + 1 }) ??
                Item.implementation.create(
                    foundry.utils.mergeObject(subitem.toObject(), {
                        "system.containerId": parentItem.system.containerId,
                    }),
                    { parent: parentItem.actor, keepId }
                )
            );
        })();

        await Promise.all([deletePromise, createPromise]);
    }
}

async function consumeItem(event: Event, item: ConsumablePF2e) {
    const uses = item.uses;
    if (uses.max && uses.value < 1) return null;

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
    const contentHTML = createHTMLElement("div", {
        innerHTML: (await item.toMessage(event, { create: false }))!.content,
    }).firstElementChild as HTMLElement;

    contentHTML.querySelector("button[data-action='consume']")?.remove();
    contentHTML.querySelector("footer")?.remove();

    const flavor = contentHTML.outerHTML;

    if (item.system.damage) {
        const DamageRoll = getDamageRollClass();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);

        roll.toMessage({
            speaker,
            flavor,
            flags,
        });
    } else {
        ChatMessage.create({ speaker, content: flavor, flags });
    }

    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const quantityRemaining = item.quantity;

        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (quantityRemaining <= 1 && !isPreservedAmmo) {
            return item.delete();
        } else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    } else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}

function hasFreePropertySlot(item: WeaponPF2e) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}

/** Determine in a type-safe way whether an `ItemPF2e` or `ItemSourcePF2e` is among certain types */
function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is TType extends "physical"
    ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"]
    : TType extends ItemType
    ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"]
    : never;
function itemIsOfType<TParent extends ActorPF2e | null>(
    item: ItemOrSource,
    type: "physical"
): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
function itemIsOfType(item: ItemOrSource, ...types: string[]): boolean {
    return (
        typeof item.name === "string" &&
        types.some((t) =>
            t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t
        )
    );
}

type ItemOrSource = PreCreate<ItemSourcePF2e> | ItemPF2e;

export {
    ITEM_CARRY_TYPES,
    PHYSICAL_ITEM_TYPES,
    consumeItem,
    detachSubitem,
    hasFreePropertySlot,
    itemIsOfType,
};
