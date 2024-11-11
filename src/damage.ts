import { getDamageRollClass } from "./classes";

async function rollDamageFromFormula(
    actor: ActorPF2e,
    formula: string,
    { actionName, item, token, target }: RollDamageExtraOptions = {}
) {
    const DamageRoll = getDamageRollClass();
    const roll = await new DamageRoll(formula, { actor, item }).evaluate();
    const traits = item?.system.traits.value ?? [];

    const context = {
        type: "damage-roll",
        sourceType: "attack",
        actor: actor.id,
        token: token?.id,
        target: target ?? null,
        domains: [],
        options: [traits, actor.getRollOptions(), item?.getRollOptions("item") ?? []].flat(),
        mapIncreases: undefined,
        notes: [],
        secret: false,
        rollMode: "roll",
        traits,
        skipDialog: false,
        outcome: null,
        unadjustedOutcome: null,
    };

    const flags: DeepPartial<foundry.documents.ChatMessageFlags> = {
        pf2e: {
            context,
            origin: item?.getOriginData(),
        },
        ["pf2e-dailies"]: {
            targetHelper: {},
        },
    };

    if (target?.token) {
        flags["pf2e-toolbelt"] = {
            targetHelper: {
                targets: [target.token],
            },
        };
    }

    actionName ??= item?.name ?? game.i18n.localize("PF2E.DamageRoll");

    let flavor = `<h4 class="action"><strong>${actionName}</strong></h4>`;
    flavor += '<div class="tags" data-tooltip-class="pf2e">';
    flavor += traits
        .map((tag) => {
            const label = game.i18n.localize(CONFIG.PF2E.actionTraits[tag]);
            const tooltip = CONFIG.PF2E.traitsDescriptions[tag];
            return `<span class="tag" data-trait="${tag}" data-tooltip="${tooltip}">${label}</span>`;
        })
        .join("");
    flavor += "</div><hr>";

    return roll.toMessage({
        flavor,
        speaker: getDocumentClass("ChatMessage").getSpeaker({ actor, token }),
        flags,
    });
}

type RollDamageExtraOptions = {
    item?: ItemPF2e;
    token?: TokenPF2e;
    actionName?: string;
    target?: {
        actor: string;
        token?: string;
    };
};

export type { RollDamageExtraOptions };
export { rollDamageFromFormula };
