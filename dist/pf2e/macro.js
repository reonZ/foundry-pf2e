"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMacroActor = exports.openAttackpopup = void 0;
const object_1 = require("../object");
const dom_1 = require("./dom");
const misc_1 = require("./misc");
function resolveMacroActor(uuid) {
    if (uuid) {
        const actor = fromUuidSync(uuid);
        return (0, object_1.isInstanceOf)(actor, "ActorPF2e") ? actor : null;
    }
    const speaker = ChatMessage.getSpeaker();
    return (canvas.tokens.get(speaker.token ?? "")?.actor ??
        game.actors.get(speaker.actor ?? "") ??
        null);
}
exports.resolveMacroActor = resolveMacroActor;
function openAttackpopup(actor, { elementTrait, itemId, slug, type }, position) {
    // If the app is already rendered, close it
    const closedExisting = (partialId) => {
        const appId = `AttackPopout-Actor-${actor.id}-${partialId}`;
        const existing = Object.values(actor.apps).find((a) => a?.id === appId);
        if (existing) {
            existing.close({ force: true });
            return true;
        }
        return false;
    };
    switch (type) {
        case "blast": {
            if (closedExisting(`blast-${elementTrait}`))
                return;
            const auraActive = actor.itemTypes.effect.find((e) => e.slug === "effect-kinetic-aura");
            if (!auraActive) {
                ui.notifications.error("PF2E.MacroActionNoActionError", { localize: true });
                return;
            }
            const AttackPopout = getAttackPopout();
            new AttackPopout(actor, { type, elementTrait }).render(true, position);
            return;
        }
        case "strike": {
            const strikes = actor.system.actions;
            const strike = strikes.find((s) => s.item.id === itemId && s.slug === slug) ??
                strikes.find((s) => s.slug === slug);
            if (closedExisting(`strike-${itemId}-${slug}`))
                return;
            if (!strike) {
                ui.notifications.error("PF2E.MacroActionNoActionError", { localize: true });
                return;
            }
            const AttackPopout = getAttackPopout();
            new AttackPopout(actor, { type, strikeItemId: itemId, strikeSlug: slug }).render(true, position);
            return;
        }
    }
}
exports.openAttackpopup = openAttackpopup;
function getAttackPopout() {
    const CharacterSheetClass = CONFIG.Actor.sheetClasses.character["pf2e.CharacterSheetPF2e"]
        .cls;
    return class AttackPopout extends CharacterSheetClass {
        type = "strike";
        #strikeItemId = "";
        #strikeSlug = "";
        #strike;
        #elementTrait;
        #blasts = [];
        get template() {
            return "systems/pf2e/templates/actors/character/attack-popout.hbs";
        }
        get id() {
            const id = super.id;
            return this.type === "strike"
                ? `${id}-strike-${this.#strikeItemId}-${this.#strikeSlug}`
                : `${id}-blast-${this.#elementTrait}`;
        }
        static get defaultOptions() {
            const options = super.defaultOptions;
            return {
                ...options,
                classes: [...options.classes, "attack-popout"],
                submitOnChange: false,
                submitOnClose: false,
                width: 520,
                height: "auto",
                resizable: false,
            };
        }
        get label() {
            if (this.type === "blast") {
                return this.#blasts.at(0)?.label ?? null;
            }
            return this.#strike?.label ?? null;
        }
        constructor(object, options) {
            super(object, options);
            if (!options.type) {
                throw (0, misc_1.ErrorPF2e)('AttackPopout is missing mandatory "type" option.');
            }
            if (options.type === "blast") {
                if (!options.elementTrait) {
                    throw (0, misc_1.ErrorPF2e)('AttackPopout of type "blast" is missing mandatory "elementalTrait" option.');
                }
                this.#elementTrait = options.elementTrait;
            }
            else {
                if (!options.strikeSlug) {
                    throw (0, misc_1.ErrorPF2e)('AttackPopout of type "strike" is missing mandatory "strikeSlug" option.');
                }
                if (!options.strikeItemId) {
                    throw (0, misc_1.ErrorPF2e)('AttackPopout of type "strike" is missing mandatory "strikeItemId" option.');
                }
                this.#strikeSlug = options.strikeSlug;
                this.#strikeItemId = options.strikeItemId;
            }
            this.type = options.type;
        }
        async getData(options) {
            const base = await super.getData(options);
            if (this.type === "blast") {
                base.elementalBlasts = this.#blasts = base.elementalBlasts.filter((b) => b.element === this.#elementTrait);
                base.data.actions = [];
                base.toggles.actions =
                    base.toggles.actions?.filter((t) => t.domain === "elemental-blast") ?? [];
            }
            else {
                base.elementalBlasts = [];
                if (this.#strikeSlug && this.#strikeItemId) {
                    this.#strike = base.data.actions.find((a) => a.item.id === this.#strikeItemId && a.slug === this.#strikeSlug);
                }
            }
            return {
                ...base,
                strike: this.#strike,
                strikeIndex: base.data.actions.findIndex((a) => a === this.#strike),
                popoutType: this.type,
            };
        }
        activateListeners($html) {
            super.activateListeners($html);
            const html = $html[0];
            // The label is only available after `getData` so the title has to be set here
            const { label } = this;
            if (label) {
                const title = (0, dom_1.htmlQuery)((0, dom_1.htmlClosest)(html, "div.window-app"), "h4.window-title");
                if (title) {
                    title.innerHTML = game.i18n.localize(label);
                }
            }
        }
        _getHeaderButtons() {
            // Remove all buttons except the close button. `Close` is a core translation key
            return super._getHeaderButtons().filter((b) => b.label === "Close");
        }
    };
}
