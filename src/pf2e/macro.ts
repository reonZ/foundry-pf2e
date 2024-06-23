import { isInstanceOf } from "../object";
import { htmlClosest, htmlQuery } from "./dom";
import { ErrorPF2e } from "./misc";

function resolveMacroActor(uuid?: ActorUUID): ActorPF2e | null {
    if (uuid) {
        const actor = fromUuidSync(uuid);
        return isInstanceOf(actor, "ActorPF2e") ? actor : null;
    }
    const speaker = ChatMessage.getSpeaker();
    return (
        canvas.tokens.get(speaker.token ?? "")?.actor ??
        game.actors.get(speaker.actor ?? "") ??
        null
    );
}

function openAttackpopup(
    actor: CharacterPF2e,
    { elementTrait, itemId, slug, type }: RollActionMacroParams,
    position?: ApplicationPosition
) {
    // If the app is already rendered, close it
    const closedExisting = (partialId: string): boolean => {
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
            if (closedExisting(`blast-${elementTrait}`)) return;
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
            const strike =
                strikes.find((s) => s.item.id === itemId && s.slug === slug) ??
                strikes.find((s) => s.slug === slug);

            if (closedExisting(`strike-${itemId}-${slug}`)) return;
            if (!strike) {
                ui.notifications.error("PF2E.MacroActionNoActionError", { localize: true });
                return;
            }

            const AttackPopout = getAttackPopout();
            new AttackPopout(actor, { type, strikeItemId: itemId, strikeSlug: slug }).render(
                true,
                position
            );
            return;
        }
    }
}

function getAttackPopout() {
    const CharacterSheetClass = CONFIG.Actor.sheetClasses.character["pf2e.CharacterSheetPF2e"]
        .cls as typeof CharacterSheetPF2e;

    return class AttackPopout<TActor extends CharacterPF2e> extends CharacterSheetClass<TActor> {
        type: "strike" | "blast" = "strike";
        #strikeItemId = "";
        #strikeSlug = "";
        #strike?: CharacterStrike;
        #elementTrait?: ElementTrait;
        #blasts: ElementalBlastConfig[] = [];

        override get template(): string {
            return "systems/pf2e/templates/actors/character/attack-popout.hbs";
        }

        override get id(): string {
            const id = super.id;
            return this.type === "strike"
                ? `${id}-strike-${this.#strikeItemId}-${this.#strikeSlug}`
                : `${id}-blast-${this.#elementTrait}`;
        }

        static override get defaultOptions(): ActorSheetOptions {
            return {
                ...super.defaultOptions,
                submitOnChange: false,
                submitOnClose: false,
                width: 480,
                height: "auto",
                resizable: false,
            };
        }

        get label(): string | null {
            if (this.type === "blast") {
                return this.#blasts.at(0)?.label ?? null;
            }
            return this.#strike?.label ?? null;
        }

        constructor(object: TActor, options: AttackPopoutOptions) {
            super(object, options);

            if (!options.type) {
                throw ErrorPF2e('AttackPopout is missing mandatory "type" option.');
            }

            if (options.type === "blast") {
                if (!options.elementTrait) {
                    throw ErrorPF2e(
                        'AttackPopout of type "blast" is missing mandatory "elementalTrait" option.'
                    );
                }
                this.#elementTrait = options.elementTrait;
            } else {
                if (!options.strikeSlug) {
                    throw ErrorPF2e(
                        'AttackPopout of type "strike" is missing mandatory "strikeSlug" option.'
                    );
                }
                if (!options.strikeItemId) {
                    throw ErrorPF2e(
                        'AttackPopout of type "strike" is missing mandatory "strikeItemId" option.'
                    );
                }
                this.#strikeSlug = options.strikeSlug;
                this.#strikeItemId = options.strikeItemId;
            }
            this.type = options.type;
        }

        override async getData(options: ActorSheetOptions): Promise<AttackPopoutData<TActor>> {
            const base = await super.getData(options);

            if (this.type === "blast") {
                base.elementalBlasts = this.#blasts = base.elementalBlasts.filter(
                    (b) => b.element === this.#elementTrait
                );
                base.data.actions = [];
                base.toggles.actions =
                    base.toggles.actions?.filter((t) => t.domain === "elemental-blast") ?? [];
            } else {
                base.elementalBlasts = [];
                if (this.#strikeSlug && this.#strikeItemId) {
                    this.#strike = base.data.actions.find(
                        (a) => a.item.id === this.#strikeItemId && a.slug === this.#strikeSlug
                    );
                }
            }

            return {
                ...base,
                strike: this.#strike,
                strikeIndex: base.data.actions.findIndex((a) => a === this.#strike),
                popoutType: this.type,
            };
        }

        override activateListeners($html: JQuery<HTMLElement>): void {
            super.activateListeners($html);
            const html = $html[0];

            // The label is only available after `getData` so the title has to be set here
            const { label } = this;
            if (label) {
                const title = htmlQuery(htmlClosest(html, "div.window-app"), "h4.window-title");
                if (title) {
                    title.innerHTML = game.i18n.localize(label);
                }
            }
        }

        protected override _getHeaderButtons(): ApplicationHeaderButton[] {
            // Remove all buttons except the close button. `Close` is a core translation key
            return super._getHeaderButtons().filter((b) => b.label === "Close");
        }
    };
}

interface BaseAttackPopoutOptions extends Partial<ActorSheetOptions> {
    type: string;
}

interface StrikePopoutOptions extends BaseAttackPopoutOptions {
    type: "strike";
    strikeSlug?: string;
    strikeItemId?: string;
}

interface BlastPopoutOptions extends BaseAttackPopoutOptions {
    type: "blast";
    elementTrait?: ElementTrait;
}

type AttackPopoutOptions = StrikePopoutOptions | BlastPopoutOptions;

interface AttackPopoutData<TActor extends CharacterPF2e> extends CharacterSheetData<TActor> {
    strike?: CharacterStrike;
    strikeIndex?: number;
    popoutType: AttackPopoutOptions["type"];
}

interface RollActionMacroParams {
    itemId?: string;
    slug?: string;
    elementTrait?: ElementTrait;
    type?: "blast" | "strike";
}

export { openAttackpopup, resolveMacroActor };
