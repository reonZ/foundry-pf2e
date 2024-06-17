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
exports.resetActors = exports.SKILL_SLUGS = exports.SKILL_EXPANDED = exports.SAVE_TYPES = exports.ACTOR_TYPES = void 0;
const R = __importStar(require("remeda"));
const ACTOR_TYPES = [
    "army",
    "character",
    "familiar",
    "hazard",
    "loot",
    "npc",
    "party",
    "vehicle",
];
exports.ACTOR_TYPES = ACTOR_TYPES;
const SAVE_TYPES = ["fortitude", "reflex", "will"];
exports.SAVE_TYPES = SAVE_TYPES;
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
]);
exports.SKILL_SLUGS = SKILL_SLUGS;
const SKILL_EXPANDED = {
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
exports.SKILL_EXPANDED = SKILL_EXPANDED;
/**
 * Reset and rerender a provided list of actors. Omit argument to reset all world and synthetic actors
 * @param [actors] A list of actors to refresh: if none are provided, all world and synthetic actors are retrieved
 * @param [options] Render options for actor sheets and tokens
 * @param [options.sheets=true] Render actor sheets
 * @param [options.tokens=false] Redraw tokens
 */
async function resetActors(actors, options = {}) {
    actors ??= [
        game.actors.contents,
        game.scenes.contents.flatMap((s) => s.tokens.contents).flatMap((t) => t.actor ?? []),
    ].flat();
    actors = R.unique(Array.from(actors));
    options.sheets ??= true;
    for (const actor of actors) {
        actor.reset();
        if (options.sheets)
            actor.render();
    }
    game.pf2e.effectPanel.refresh();
    // If expired effects are automatically removed, the actor update cycle will reinitialize vision
    const refreshScenes = game.settings.get("pf2e", "automation.effectExpiration") &&
        !game.settings.get("pf2e", "automation.removeExpiredEffects");
    if (refreshScenes) {
        const scenes = R.unique(Array.from(actors)
            .flatMap((a) => a.getActiveTokens(false, true))
            .flatMap((t) => t.scene));
        for (const scene of scenes) {
            scene.reset();
            if (scene.isView) {
                canvas.perception.update({ initializeVision: true }, true);
            }
        }
    }
    if (options.tokens) {
        for (const token of R.unique(Array.from(actors).flatMap((a) => a.getActiveTokens(true, true)))) {
            token.simulateUpdate();
        }
    }
}
exports.resetActors = resetActors;
