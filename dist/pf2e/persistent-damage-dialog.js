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
exports.PersistentDialog = void 0;
const classes_1 = require("../classes");
const damage_1 = require("./damage");
const dom_1 = require("./dom");
const R = __importStar(require("remeda"));
class PersistentDamageDialog extends Application {
    actor;
    constructor(actor, options = {}) {
        super(options);
        this.actor = actor;
        actor.apps[this.appId] = this;
    }
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            classes: ["persistent-damage-dialog"],
            template: "systems/pf2e/templates/items/persistent-damage-dialog.hbs",
            width: 380,
            height: "auto",
        };
    }
    /** Override to guarantee one persistent damage dialog per actor */
    get id() {
        return `persistent-damage-${this.actor.id}`;
    }
    get title() {
        return game.i18n.format("PF2E.Item.Condition.PersistentDamage.Dialog.Title", {
            actor: this.actor.name,
        });
    }
    async getData() {
        const existing = this.actor.itemTypes.condition
            .filter((c) => c.slug === "persistent-damage")
            .map((c) => ({
            id: c.id,
            bullet: (0, damage_1.damageDiceIcon)(c.system.persistent.damage).outerHTML,
            active: c.active,
            ...R.pick(c.system.persistent, ["formula", "damageType", "dc"]),
        }));
        return {
            existing,
            damageTypes: this.#prepareDamageTypes(),
        };
    }
    #prepareDamageTypes() {
        const types = Object.keys(CONFIG.PF2E.damageTypes).map((type) => {
            const labels = CONFIG.PF2E.damageTypes;
            const icons = damage_1.DAMAGE_TYPE_ICONS;
            const faGlyph = icons[type] ?? "question";
            return {
                type,
                iconClass: `fa-${faGlyph}`,
                label: game.i18n.localize(labels[type] ?? type),
            };
        });
        return types.sort((a, b) => a.label.localeCompare(b.label));
    }
    /** Determine whether an inputted formula is valid, reporting to the user if not. */
    #reportFormulaValidity(formula, input) {
        if (!input)
            return false;
        const DamageRoll = (0, classes_1.getDamageRollClass)();
        const isValid = formula.length > 0 &&
            DamageRoll.validate(formula) &&
            new DamageRoll(formula, { evaluatePersistent: true }).maximumValue >= 0;
        if (isValid) {
            input.setCustomValidity("");
        }
        else {
            input.setCustomValidity(game.i18n.localize("PF2E.Item.Condition.PersistentDamage.Dialog.Invalid"));
            input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
        }
        return input.reportValidity();
    }
    activateListeners($html) {
        const html = $html[0];
        for (const section of (0, dom_1.htmlQueryAll)(html, ".persistent-entry[data-id")) {
            const id = section.dataset.id;
            const existing = this.actor.items.get(id, { strict: true });
            const elements = this.#getInputElements(section);
            for (const element of Object.values(elements)) {
                element?.addEventListener("change", () => {
                    const formula = elements.formula?.value.trim() ?? "";
                    const damageType = elements.damageType?.value;
                    const dc = Number(elements.dc?.value) || 15;
                    if (this.#reportFormulaValidity(formula, elements.formula)) {
                        existing.update({ system: { persistent: { formula, damageType, dc } } });
                    }
                });
            }
            (0, dom_1.htmlQuery)(section, "a[data-action=delete")?.addEventListener("click", () => {
                existing.delete();
            });
        }
        html.querySelector("a[data-action=add]")?.addEventListener("click", (event) => {
            const section = (0, dom_1.htmlClosest)(event.target, ".persistent-entry");
            if (!section)
                return;
            const elements = this.#getInputElements(section);
            const formula = elements.formula?.value.trim() || "1d6";
            const damageType = elements.damageType?.value;
            const dc = Number(elements.dc?.value) || 15;
            if (this.#reportFormulaValidity(`(${formula})[${damageType}]`, elements.formula)) {
                const baseConditionSource = game.pf2e.ConditionManager.getCondition("persistent-damage").toObject();
                const persistentSource = foundry.utils.mergeObject(baseConditionSource, {
                    system: {
                        persistent: { formula, damageType, dc },
                    },
                });
                this.actor.createEmbeddedDocuments("Item", [persistentSource]);
            }
        });
        html.querySelector("a[data-action=roll-persistent]")?.addEventListener("click", () => {
            const existing = this.actor.itemTypes.condition.filter((c) => c.slug === "persistent-damage");
            for (const condition of existing) {
                condition.onEndTurn();
            }
        });
    }
    #getInputElements(section) {
        return {
            formula: (0, dom_1.htmlQuery)(section, ".formula"),
            damageType: (0, dom_1.htmlQuery)(section, ".damageType"),
            dc: (0, dom_1.htmlQuery)(section, ".dc"),
        };
    }
    /** Overriden to autofocus on first render behavior */
    _injectHTML($html) {
        super._injectHTML($html);
        const html = $html[0];
        // Since this is an initial render, focus the formula
        const existing = this.options.editing
            ? (0, dom_1.htmlQuery)(html, `[data-id=${this.options.editing}] .formula`)
            : null;
        (existing ?? (0, dom_1.htmlQuery)(html, ".new .formula"))?.focus();
    }
}
exports.PersistentDialog = PersistentDamageDialog;
