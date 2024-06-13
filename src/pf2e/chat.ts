import { createHTMLElement } from "../html";
import { isInstanceOf } from "../object";
import { htmlQuery } from "./dom";
import { ErrorPF2e } from "./misc";
import { extractEphemeralEffects } from "./rules";

/** Toggle off the Shield Block button on a damage chat message */
function toggleOffShieldBlock(messageId: string): void {
    for (const app of ["#chat-log", "#chat-popout"]) {
        const selector = `${app} > li.chat-message[data-message-id="${messageId}"] button[data-action$=shield-block]`;
        // changed
        for (const button of document.body.querySelectorAll(selector)) {
            button.classList.remove("shield-activated");
        }
    }
    CONFIG.PF2E.chatDamageButtonShieldToggle = false;
}

function onClickShieldBlock(
    shieldButton: HTMLButtonElement,
    messageEl: HTMLElement,
    // added
    token?: TokenDocumentPF2e
): void {
    const getTokens = (): TokenDocumentPF2e[] => {
        // added
        if (token) return [token];

        const tokens = game.user.getActiveTokens();
        if (tokens.length === 0) {
            ui.notifications.error("PF2E.ErrorMessage.NoTokenSelected", { localize: true });
        }
        return tokens;
    };
    const getNonBrokenShields = (tokens: TokenDocumentPF2e[]): ShieldPF2e<ActorPF2e>[] => {
        const actor = tokens.find((t) => !!t.actor)?.actor;
        return (
            actor?.itemTypes.shield.filter((s) => s.isEquipped && !s.isBroken && !s.isDestroyed) ??
            []
        );
    };

    // Add a tooltipster instance to the shield button if needed.
    if (!shieldButton.classList.contains("tooltipstered")) {
        $(shieldButton)
            .tooltipster({
                animation: "fade",
                trigger: "click",
                arrow: false,
                content: htmlQuery(messageEl, "div.hover-content"),
                contentAsHTML: true,
                contentCloning: true,
                debug: false,
                interactive: true,
                side: ["top"],
                theme: "crb-hover",
                functionBefore: (): boolean => {
                    const tokens = getTokens();
                    if (tokens.length === 0) return false;

                    const nonBrokenShields = getNonBrokenShields(tokens);
                    const hasMultipleShields = tokens.length === 1 && nonBrokenShields.length > 1;
                    const shieldActivated = shieldButton.classList.contains("shield-activated");

                    // More than one shield and no selection. Show tooltip.
                    if (hasMultipleShields && !shieldActivated) {
                        return true;
                    }

                    // More than one shield and one was previously selected. Remove selection and show tooltip.
                    if (hasMultipleShields && shieldButton.dataset.shieldId) {
                        shieldButton.attributes.removeNamedItem("data-shield-id");
                        shieldButton.classList.remove("shield-activated");
                        CONFIG.PF2E.chatDamageButtonShieldToggle = false;
                        return true;
                    }

                    // Normal toggle behaviour. Tooltip is suppressed.
                    shieldButton.classList.toggle("shield-activated");
                    CONFIG.PF2E.chatDamageButtonShieldToggle =
                        !CONFIG.PF2E.chatDamageButtonShieldToggle;
                    return false;
                },
                functionFormat: (instance, _helper, contentEl: HTMLElement): string | JQuery => {
                    const tokens = getTokens();
                    const nonBrokenShields = getNonBrokenShields(tokens);
                    const multipleShields = tokens.length === 1 && nonBrokenShields.length > 1;
                    const shieldActivated = shieldButton.classList.contains("shield-activated");

                    // If the actor is wielding more than one shield, have the user pick which shield to use for blocking.
                    if (multipleShields && !shieldActivated) {
                        // Populate the list with the shield options
                        const listEl = htmlQuery(contentEl, "ul.shield-options");
                        if (!listEl) return $(contentEl);

                        const shieldList = nonBrokenShields.map((shield): HTMLLIElement => {
                            const input = document.createElement("input");
                            input.classList.add("data");
                            input.type = "radio";
                            input.name = "shield-id";
                            input.value = shield.id;
                            input.addEventListener("click", () => {
                                shieldButton.dataset.shieldId = input.value;
                                shieldButton.classList.add("shield-activated");
                                CONFIG.PF2E.chatDamageButtonShieldToggle = true;
                                instance.close();
                            });
                            const shieldName = document.createElement("span");
                            shieldName.classList.add("label");
                            shieldName.innerHTML = shield.name;

                            const hardness = document.createElement("span");
                            hardness.classList.add("tag");
                            const hardnessLabel = game.i18n.localize("PF2E.HardnessLabel");
                            hardness.innerHTML = `${hardnessLabel}: ${shield.hardness}`;

                            const itemLi = document.createElement("li");
                            itemLi.classList.add("item");
                            itemLi.append(input, shieldName, hardness);

                            return itemLi;
                        });

                        listEl.replaceChildren(...shieldList);
                    }

                    return $(contentEl);
                },
            })
            .tooltipster("open");
    }
}

async function applyDamageFromMessage({
    message,
    multiplier = 1,
    addend = 0,
    promptModifier = false,
    rollIndex = 0,
    // added
    tokens,
    onDamageApplied,
}: ApplyDamageFromMessageParams): Promise<void> {
    if (promptModifier) return shiftAdjustDamage(message, multiplier, rollIndex);

    const html = htmlQuery(ui.chat.element[0], `li.chat-message[data-message-id="${message.id}"]`);
    tokens ??=
        html?.dataset.actorIsTarget && message.token
            ? [message.token]
            : game.user.getActiveTokens();
    if (tokens.length === 0) {
        ui.notifications.error("PF2E.ErrorMessage.NoTokenSelected", { localize: true });
        return;
    }

    const shieldBlockRequest = CONFIG.PF2E.chatDamageButtonShieldToggle;
    const roll = message.rolls.at(rollIndex);
    if (!isInstanceOf(roll, "DamageRoll"))
        throw ErrorPF2e("Unexpected error retrieving damage roll");

    const damage =
        multiplier < 0 ? multiplier * roll.total + addend : roll.alter(multiplier, addend);

    // Get origin roll options and apply damage to a contextual clone: this may influence condition IWR, for example
    const messageRollOptions = [...(message.flags.pf2e.context?.options ?? [])];
    const originRollOptions = messageRollOptions
        .filter((o) => o.startsWith("self:"))
        .map((o) => o.replace(/^self/, "origin"));
    const messageItem = message.item;
    const effectRollOptions = messageItem?.isOfType("affliction", "condition", "effect")
        ? messageItem.getRollOptions("item")
        : [];

    for (const token of tokens) {
        if (!token.actor) continue;

        // If no target was acquired during a roll, set roll options for it during damage application
        if (!messageRollOptions.some((o) => o.startsWith("target"))) {
            messageRollOptions.push(...token.actor.getSelfRollOptions("target"));
        }
        const domain = multiplier > 0 ? "damage-received" : "healing-received";
        const ephemeralEffects =
            multiplier > 0
                ? await extractEphemeralEffects({
                      affects: "target",
                      origin: message.actor,
                      target: token.actor,
                      item: message.item,
                      domains: [domain],
                      options: messageRollOptions,
                  })
                : [];
        const contextClone = token.actor.getContextualClone(originRollOptions, ephemeralEffects);
        const rollOptions = new Set([
            ...messageRollOptions.filter((o) => !/^(?:self|target):/.test(o)),
            ...effectRollOptions,
            ...originRollOptions,
            ...contextClone.getSelfRollOptions(),
        ]);

        await contextClone.applyDamage({
            damage,
            token,
            item: message.item,
            skipIWR: multiplier <= 0,
            rollOptions,
            shieldBlockRequest,
            outcome: message.flags.pf2e.context?.outcome,
        });
    }
    toggleOffShieldBlock(message.id);

    // added
    onDamageApplied?.(message, tokens, rollIndex);
}

async function shiftAdjustDamage(
    message: ChatMessagePF2e,
    multiplier: number,
    rollIndex: number,
    // added
    tokens?: TokenDocumentPF2e[],
    onDamageApplied?: ApplyDamageFromMessageCallback
): Promise<void> {
    const content = await renderTemplate(
        "systems/pf2e/templates/chat/damage/adjustment-dialog.hbs"
    );
    const AdjustmentDialog = class extends Dialog {
        override activateListeners($html: JQuery): void {
            super.activateListeners($html);
            $html[0].querySelector("input")?.focus();
        }
    };
    const isHealing = multiplier < 0;
    new AdjustmentDialog({
        title: game.i18n.localize(
            isHealing ? "PF2E.UI.shiftModifyHealingTitle" : "PF2E.UI.shiftModifyDamageTitle"
        ),
        content,
        buttons: {
            ok: {
                label: game.i18n.localize("PF2E.OK"),
                callback: async ($dialog: JQuery) => {
                    // In case of healing, multipler will have negative sign. The user will expect that positive
                    // modifier would increase healing value, while negative would decrease.
                    const adjustment =
                        (Number($dialog[0].querySelector("input")?.value) || 0) *
                        Math.sign(multiplier);
                    applyDamageFromMessage({
                        message,
                        multiplier,
                        addend: adjustment,
                        promptModifier: false,
                        rollIndex,
                        // added
                        tokens,
                        onDamageApplied,
                    });
                },
            },
            cancel: {
                label: "Cancel",
            },
        },
        default: "ok",
        close: () => {
            toggleOffShieldBlock(message.id);
        },
    }).render(true);
}

async function selfApplyEffectFromMessage(message: ChatMessagePF2e, html: HTMLElement) {
    const item = message.item;
    const actor = item?.actor ?? message.actor;
    if (!item || !actor) return;

    const button = html.querySelector<HTMLButtonElement>(
        ".message-content .message-buttons button[data-action='apply-effect'][data-targets]"
    );
    if (!button) return;

    button.disabled = true;

    const target = fromUuidSync(button.dataset.targets ?? "");
    const effect =
        item.isOfType("action", "feat") && item.system.selfEffect
            ? await fromUuid<EffectPF2e>(item.system.selfEffect.uuid)
            : null;

    if (isInstanceOf(target, "ActorPF2e") && isInstanceOf(effect, "EffectPF2e")) {
        const traits = item.system.traits.value?.filter((t) => t in CONFIG.PF2E.effectTraits) ?? [];
        const effectSource: EffectSource = foundry.utils.mergeObject(effect.toObject(), {
            _id: null,
            system: {
                context: {
                    origin: {
                        actor: actor.uuid,
                        token: message.token?.uuid ?? null,
                        item: item.uuid,
                        spellcasting: null,
                        rollOptions: item.getOriginData().rollOptions,
                    },
                    target: {
                        actor: target.uuid,
                        token: target.getActiveTokens(true, true).at(0)?.uuid ?? null,
                    },
                    roll: null,
                },
                traits: { value: traits },
            },
        });
        await target.createEmbeddedDocuments("Item", [effectSource]);
        const parsedMessageContent = ((): HTMLElement => {
            const container = document.createElement("div");
            container.innerHTML = message.content;
            return container;
        })();

        const buttons = htmlQuery(parsedMessageContent, ".message-buttons");
        if (buttons) {
            const span = createHTMLElement("span", { classes: ["effect-applied"] });
            const anchor = effect.toAnchor({ attrs: { draggable: "true" } });
            const locKey = "PF2E.Item.Action.SelfAppliedEffect.Applied";
            const statement = game.i18n.format(locKey, { effect: anchor.outerHTML });
            span.innerHTML = statement;
            buttons.replaceChildren(span);
            await message.update({ content: parsedMessageContent.innerHTML });
        }
    }
}

type ApplyDamageFromMessageCallback = (
    message: ChatMessagePF2e,
    tokens: TokenDocumentPF2e[],
    rollIndex: number
) => void;

interface ApplyDamageFromMessageParams {
    message: ChatMessagePF2e;
    multiplier?: number;
    addend?: number;
    promptModifier?: boolean;
    rollIndex?: number;
    // added stuff
    tokens?: TokenDocumentPF2e[];
    onDamageApplied?: ApplyDamageFromMessageCallback;
}

export {
    applyDamageFromMessage,
    onClickShieldBlock,
    selfApplyEffectFromMessage,
    toggleOffShieldBlock,
};
