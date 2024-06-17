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
exports.traitSlugToObject = exports.getSelectedActors = exports.eventToRollParams = exports.eventToRollMode = void 0;
const actor_1 = require("./actor");
const misc_1 = require("./misc");
const R = __importStar(require("remeda"));
const actorTypes = [...actor_1.ACTOR_TYPES];
function traitSlugToObject(trait, dictionary) {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if ((0, misc_1.objectHasKey)(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }
    return traitObject;
}
exports.traitSlugToObject = traitSlugToObject;
function getSelectedActors(options = {}) {
    const { include = actorTypes, exclude = [], assignedFallback = false } = options;
    const actors = R.unique(game.user
        .getActiveTokens()
        .flatMap((t) => t.actor &&
        (include.length === 0 || t.actor.isOfType(...include)) &&
        (exclude.length === 0 || !t.actor.isOfType(...exclude))
        ? t.actor
        : []));
    const assigned = game.user.character;
    if (actors.length > 0 || !assignedFallback || !assigned) {
        return actors;
    }
    if ((include.length === 0 || assigned.isOfType(...include)) &&
        (exclude.length === 0 || !assigned.isOfType(...exclude))) {
        return [assigned];
    }
    return [];
}
exports.getSelectedActors = getSelectedActors;
function isRelevantEvent(event) {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}
/** Set roll mode and dialog skipping from a user's input */
function eventToRollParams(event, rollType) {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !game.user.settings[key];
    if (!isRelevantEvent(event))
        return { skipDialog: skipDefault };
    const params = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }
    return params;
}
exports.eventToRollParams = eventToRollParams;
function eventToRollMode(event) {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey))
        return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}
exports.eventToRollMode = eventToRollMode;
