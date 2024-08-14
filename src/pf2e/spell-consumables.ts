import { ErrorPF2e, setHasElement } from "./misc";
import * as R from "remeda";
import { MAGIC_TRADITIONS } from "./spell";
import { isInstanceOf } from "../object";
import { getSourceId } from "../item";

const CANTRIP_DECK_ID = "tLa4bewBhyqzi6Ow";

const scrollCompendiumIds: Record<number, string | undefined> = {
    1: "RjuupS9xyXDLgyIr",
    2: "Y7UD64foDbDMV9sx",
    3: "ZmefGBXGJF3CFDbn",
    4: "QSQZJ5BC3DeHv153",
    5: "tjLvRWklAylFhBHQ",
    6: "4sGIy77COooxhQuC",
    7: "fomEZZ4MxVVK3uVu",
    8: "iPki3yuoucnj7bIt",
    9: "cFHomF3tty8Wi1e5",
    10: "o1XIHJ4MJyroAHfF",
};

const wandCompendiumIds: Record<number, string | undefined> = {
    1: "UJWiN0K3jqVjxvKk",
    2: "vJZ49cgi8szuQXAD",
    3: "wrDmWkGxmwzYtfiA",
    4: "Sn7v9SsbEDMUIwrO",
    5: "5BF7zMnrPYzyigCs",
    6: "kiXh4SUWKr166ZeM",
    7: "nmXPj9zuMRQBNT60",
    8: "Qs8RgNH6thRPv2jt",
    9: "Fgv722039TVM5JTc",
};

const SPELL_CONSUMABLE_NAME_TEMPLATES = {
    cantripDeck5: "PF2E.Item.Physical.FromSpell.CantripDeck5",
    scroll: "PF2E.Item.Physical.FromSpell.Scroll",
    wand: "PF2E.Item.Physical.FromSpell.Wand",
};

function getIdForSpellConsumable(
    type: SpellConsumableItemType,
    heightenedLevel: number
): string | null {
    switch (type) {
        case "cantripDeck5":
            return CANTRIP_DECK_ID;
        case "scroll":
            return scrollCompendiumIds[heightenedLevel] ?? null;
        default:
            return wandCompendiumIds[heightenedLevel] ?? null;
    }
}

function getNameForSpellConsumable(
    type: SpellConsumableItemType | string,
    spellName: string,
    heightenedLevel: number
): string {
    const templateId =
        SPELL_CONSUMABLE_NAME_TEMPLATES[type as SpellConsumableItemType] ||
        `${type} of {name} (Rank {level})`;
    return game.i18n.format(templateId, { name: spellName, level: heightenedLevel });
}

async function createConsumableFromSpell(
    spell: SpellPF2e,
    {
        type,
        heightenedLevel = spell.baseRank,
        mystified = false,
        temp,
        itemName,
        itemImg,
    }: {
        type: SpellConsumableItemType;
        heightenedLevel?: number;
        mystified?: boolean;
        // added stuff
        temp?: boolean;
        itemName?: string;
        itemImg?: ImageFilePath;
    }
) {
    const pack = game.packs.find((p) => p.collection === "pf2e.equipment-srd");
    const itemId = getIdForSpellConsumable(type, heightenedLevel);
    const consumable = await pack?.getDocument(itemId ?? "");

    if (!isInstanceOf(consumable, "ConsumablePF2e")) {
        throw ErrorPF2e("Failed to retrieve consumable item");
    }

    const consumableSource = {
        // @ts-ignore
        ...consumable.toObject(),
        _id: null,
    }; // Clear _id
    const traits = consumableSource.system.traits;

    traits.value = R.unique([...traits.value, ...spell.traits]);
    traits.rarity = spell.rarity;

    if (
        traits.value.includes("magical") &&
        traits.value.some((t) => setHasElement(MAGIC_TRADITIONS, t))
    ) {
        traits.value.splice(traits.value.indexOf("magical"), 1);
    }

    traits.value.sort();

    consumableSource.name = getNameForSpellConsumable(
        itemName ?? type,
        spell.name,
        heightenedLevel
    );
    const description = consumableSource.system.description.value;

    consumableSource.system.description.value = (() => {
        const paragraphElement = document.createElement("p");
        const sourceId = getSourceId(spell);

        paragraphElement.append(sourceId ? `@UUID[${sourceId}]{${spell.name}}` : spell.description);

        const containerElement = document.createElement("div");
        const hrElement = document.createElement("hr");

        containerElement.append(paragraphElement, hrElement);
        hrElement.insertAdjacentHTML("afterend", description);

        return containerElement.innerHTML;
    })();

    // Cantrip deck casts at level 1
    if (type !== "cantripDeck5") {
        consumableSource.system.spell = foundry.utils.mergeObject(
            spell._source,
            {
                _id: foundry.utils.randomID(),
                system: { location: { value: null, heightenedLevel } },
            },
            { inplace: false }
        );
    }

    if (mystified) {
        consumableSource.system.identification.status = "unidentified";
    }

    if (typeof itemImg === "string") {
        consumableSource.img = itemImg;
    }

    if (temp) {
        consumableSource.system.temporary = true;
    }

    return consumableSource as unknown as PreCreate<ConsumableSource>;
}

export { createConsumableFromSpell };
