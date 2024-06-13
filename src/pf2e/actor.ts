import * as R from "remeda";

const SAVE_TYPES = ["fortitude", "reflex", "will"] as const;

const SKILL_SLUGS = new Set([
    "acrobatics",
    "arcana",
    "athletics",
    "crafting",
    "deception",
    "diplomacy",
    "intimidation",
    "medicine",
    "nature",
    "occultism",
    "performance",
    "religion",
    "society",
    "stealth",
    "survival",
    "thievery",
] as const);

const SKILL_EXPANDED: Record<SkillSlug, SkillExpanded> = {
    acrobatics: { attribute: "dex" },
    arcana: { attribute: "int" },
    athletics: { attribute: "str" },
    crafting: { attribute: "int" },
    deception: { attribute: "cha" },
    diplomacy: { attribute: "cha" },
    intimidation: { attribute: "cha" },
    medicine: { attribute: "wis" },
    nature: { attribute: "wis" },
    occultism: { attribute: "int" },
    performance: { attribute: "cha" },
    religion: { attribute: "wis" },
    society: { attribute: "int" },
    stealth: { attribute: "dex" },
    survival: { attribute: "wis" },
    thievery: { attribute: "dex" },
};

/**
 * Reset and rerender a provided list of actors. Omit argument to reset all world and synthetic actors
 * @param [actors] A list of actors to refresh: if none are provided, all world and synthetic actors are retrieved
 * @param [options] Render options for actor sheets and tokens
 * @param [options.sheets=true] Render actor sheets
 * @param [options.tokens=false] Redraw tokens
 */
async function resetActors(
    actors?: Iterable<ActorPF2e>,
    options: ResetActorsRenderOptions = {}
): Promise<void> {
    actors ??= [
        game.actors.contents,
        game.scenes.contents.flatMap((s) => s.tokens.contents).flatMap((t) => t.actor ?? []),
    ].flat();
    actors = R.unique(Array.from(actors));
    options.sheets ??= true;

    for (const actor of actors) {
        actor.reset();
        if (options.sheets) actor.render();
    }
    game.pf2e.effectPanel.refresh();

    // If expired effects are automatically removed, the actor update cycle will reinitialize vision
    const refreshScenes =
        game.settings.get("pf2e", "automation.effectExpiration") &&
        !game.settings.get("pf2e", "automation.removeExpiredEffects");

    if (refreshScenes) {
        const scenes = R.unique(
            Array.from(actors)
                .flatMap((a) => a.getActiveTokens(false, true))
                .flatMap((t) => t.scene)
        );
        for (const scene of scenes) {
            scene.reset();
            if (scene.isView) {
                canvas.perception.update({ initializeVision: true }, true);
            }
        }
    }

    if (options.tokens) {
        for (const token of R.unique(
            Array.from(actors).flatMap((a) => a.getActiveTokens(true, true))
        )) {
            token.simulateUpdate();
        }
    }
}

interface SkillExpanded {
    attribute: AttributeString;
}

export { SAVE_TYPES, SKILL_EXPANDED, SKILL_SLUGS, resetActors };
