import { ACTOR_TYPES } from "./actor";
import { objectHasKey } from "./misc";
import * as R from "remeda";

const actorTypes: (ActorType | "creature")[] = [...ACTOR_TYPES];

function traitSlugToObject(
    trait: string,
    dictionary: Record<string, string | undefined>
): TraitViewData {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject: TraitViewData = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }

    return traitObject;
}

function getSelectedActors(options: GetSelectedActorsOptions = {}): ActorPF2e[] {
    const { include = actorTypes, exclude = [], assignedFallback = false } = options;
    const actors = R.unique(
        game.user
            .getActiveTokens()
            .flatMap((t) =>
                t.actor &&
                (include.length === 0 || t.actor.isOfType(...include)) &&
                (exclude.length === 0 || !t.actor.isOfType(...exclude))
                    ? t.actor
                    : []
            )
    );
    const assigned = game.user.character;
    if (actors.length > 0 || !assignedFallback || !assigned) {
        return actors;
    }

    if (
        (include.length === 0 || assigned.isOfType(...include)) &&
        (exclude.length === 0 || !assigned.isOfType(...exclude))
    ) {
        return [assigned];
    }

    return [];
}

function isRelevantEvent(
    event: Maybe<JQuery.TriggeredEvent | Event>
): event is MouseEvent | TouchEvent | KeyboardEvent | WheelEvent | JQuery.TriggeredEvent {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}

/** Set roll mode and dialog skipping from a user's input */
function eventToRollParams(
    event: Maybe<JQuery.TriggeredEvent | Event>,
    rollType: { type: "check" | "damage" }
): ParamsFromEvent {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !game.user.settings[key];
    if (!isRelevantEvent(event)) return { skipDialog: skipDefault };

    const params: ParamsFromEvent = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }

    return params;
}

function eventToRollMode(event: Maybe<Event>): RollMode | "roll" {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey)) return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}

type ParamsFromEvent = { skipDialog: boolean; rollMode?: RollMode | "roll" };

interface GetSelectedActorsOptions {
    /** Actor types that should be included (defaults to all) */
    include?: (ActorType | "creature")[];
    /** Actor types that should be excluded (defaults to none) */
    exclude?: (ActorType | "creature")[];
    /** Given no qualifying actor is selected, fall back to the user's assigned character if it also qualifies. */
    assignedFallback?: boolean;
}

export { eventToRollMode, eventToRollParams, getSelectedActors, traitSlugToObject };
