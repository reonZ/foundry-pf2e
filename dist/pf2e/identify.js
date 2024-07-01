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
exports.getItemIdentificationDCs = exports.IdentifyItemPopup = void 0;
const dc_1 = require("./dc");
const misc_1 = require("./misc");
const spell_1 = require("./spell");
const R = __importStar(require("remeda"));
function getDcRarity(item) {
    return item.traits.has("cursed") ? "unique" : item.rarity;
}
function getMagicTraditions(item) {
    const traits = item.system.traits.value;
    return new Set(traits.filter((t) => (0, misc_1.setHasElement)(spell_1.MAGIC_TRADITIONS, t)));
}
function getIdentifyMagicDCs(item, baseDC, notMatchingTraditionModifier) {
    const result = {
        occult: baseDC,
        primal: baseDC,
        divine: baseDC,
        arcane: baseDC,
    };
    const traditions = getMagicTraditions(item);
    for (const key of spell_1.MAGIC_TRADITIONS) {
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
function getItemIdentificationDCs(item, { pwol = false, notMatchingTraditionModifier }) {
    const baseDC = (0, dc_1.calculateDC)(item.level, { pwol });
    const rarity = getDcRarity(item);
    const dc = (0, dc_1.adjustDCByRarity)(baseDC, rarity);
    if (item.isMagical) {
        return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
    }
    else {
        return { crafting: dc };
    }
}
exports.getItemIdentificationDCs = getItemIdentificationDCs;
class IdentifyItemPopup extends FormApplication {
    static get defaultOptions() {
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
        notMatchingTraditionModifier: game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier"),
    });
    async getData() {
        const item = this.object;
        return {
            ...(await super.getData()),
            isMagic: item.isMagical,
            isAlchemical: item.isAlchemical,
            dcs: this.dcs,
        };
    }
    activateListeners($html) {
        const html = $html[0];
        const updateButton = html.querySelector("button.update-identification");
        updateButton?.addEventListener("click", () => {
            this.submit({ updateData: { status: updateButton.value } });
        });
        // Add listener on Post skill checks to chat button that posts item unidentified img and name and skill checks
        html.querySelector("button.post-skill-checks")?.addEventListener("click", async () => {
            const item = this.object;
            const identifiedName = item.system.identification.identified.name;
            const dcs = this.dcs;
            const action = item.isMagical
                ? "identify-magic"
                : item.isAlchemical
                    ? "identify-alchemy"
                    : "recall-knowledge";
            const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs", {
                identifiedName,
                action,
                skills: R.omit(dcs, ["dc"]),
                unidentified: item.system.identification.unidentified,
                uuid: item.uuid,
            });
            await getDocumentClass("ChatMessage").create({ author: game.user.id, content });
        });
    }
    async _updateObject(_event, formData) {
        const status = formData["status"];
        if (status === "identified") {
            return this.object.setIdentificationStatus(status);
        }
    }
}
exports.IdentifyItemPopup = IdentifyItemPopup;
