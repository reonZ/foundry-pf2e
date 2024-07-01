import { type DCOptions, adjustDCByRarity, calculateDC } from "./dc";
import { setHasElement } from "./misc";
import { MAGIC_TRADITIONS } from "./spell";
import * as R from "remeda";

function getDcRarity(item: PhysicalItemPF2e): Rarity {
    return item.traits.has("cursed") ? "unique" : item.rarity;
}

function getMagicTraditions(item: PhysicalItemPF2e): Set<MagicTradition> {
    const traits: string[] = item.system.traits.value;
    return new Set(traits.filter((t): t is MagicTradition => setHasElement(MAGIC_TRADITIONS, t)));
}

function getIdentifyMagicDCs(
    item: PhysicalItemPF2e,
    baseDC: number,
    notMatchingTraditionModifier: number
): IdentifyMagicDCs {
    const result = {
        occult: baseDC,
        primal: baseDC,
        divine: baseDC,
        arcane: baseDC,
    };
    const traditions = getMagicTraditions(item);
    for (const key of MAGIC_TRADITIONS) {
        // once an item has a magic tradition, all skills
        // that don't match the tradition are hard
        if (traditions.size > 0 && !traditions.has(key)) {
            result[key] = baseDC + notMatchingTraditionModifier;
        }
    }
    return {
        arcana: result.arcane,
        nature: result.primal,
        religion: result.divine,
        occultism: result.occult,
    };
}

function getItemIdentificationDCs(
    item: PhysicalItemPF2e,
    { pwol = false, notMatchingTraditionModifier }: IdentifyItemOptions
): GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs {
    const baseDC = calculateDC(item.level, { pwol });
    const rarity = getDcRarity(item);
    const dc = adjustDCByRarity(baseDC, rarity);
    if (item.isMagical) {
        return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
    } else {
        return { crafting: dc };
    }
}

class IdentifyItemPopup extends FormApplication<PhysicalItemPF2e> {
    static override get defaultOptions(): FormApplicationOptions {
        return {
            ...super.defaultOptions,
            id: "identify-item",
            title: game.i18n.localize("PF2E.identification.Identify"),
            template: "systems/pf2e/templates/actors/identify-item.hbs",
            width: "auto",
            classes: ["identify-popup"],
        };
    }

    dcs = getItemIdentificationDCs(this.object, {
        pwol: game.pf2e.settings.variants.pwol.enabled,
        notMatchingTraditionModifier: game.settings.get(
            "pf2e",
            "identifyMagicNotMatchingTraditionModifier"
        ),
    });

    override async getData(): Promise<IdentifyPopupData> {
        const item = this.object;
        return {
            ...(await super.getData()),
            isMagic: item.isMagical,
            isAlchemical: item.isAlchemical,
            dcs: this.dcs,
        };
    }

    override activateListeners($html: JQuery): void {
        const html = $html[0];

        const updateButton = html.querySelector<HTMLButtonElement>("button.update-identification");
        updateButton?.addEventListener("click", () => {
            this.submit({ updateData: { status: updateButton.value } });
        });

        // Add listener on Post skill checks to chat button that posts item unidentified img and name and skill checks
        html.querySelector("button.post-skill-checks")?.addEventListener("click", async () => {
            const item = this.object;
            const identifiedName = item.system.identification.identified.name;
            const dcs: Record<string, number> = this.dcs;
            const action = item.isMagical
                ? "identify-magic"
                : item.isAlchemical
                ? "identify-alchemy"
                : "recall-knowledge";

            const content = await renderTemplate(
                "systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",
                {
                    identifiedName,
                    action,
                    skills: R.omit(dcs, ["dc"]),
                    unidentified: item.system.identification.unidentified,
                    uuid: item.uuid,
                }
            );

            await getDocumentClass("ChatMessage").create({ author: game.user.id, content });
        });
    }

    protected override async _updateObject(
        _event: Event,
        formData: Record<string, unknown>
    ): Promise<void> {
        const status = formData["status"];
        if (status === "identified") {
            return this.object.setIdentificationStatus(status);
        }
    }
}

interface IdentifyItemOptions extends DCOptions {
    notMatchingTraditionModifier: number;
}

type MagicSkill = Extract<SkillSlug, "arcana" | "nature" | "religion" | "occultism">;

type IdentifyMagicDCs = Record<MagicSkill, number>;
type IdentifyAlchemyDCs = { crafting: number };
type GenericIdentifyDCs = { dc: number };

interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs;
}

export { IdentifyItemPopup, getItemIdentificationDCs };
