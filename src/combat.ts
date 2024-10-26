import { eventToRollParams } from "./pf2e";

function hasRolledInitiative(combatant: CombatantPF2e): combatant is RolledCombatant {
    return typeof combatant.initiative === "number";
}

function rollInitiative(actor: ActorPF2e, statistic?: string, event?: Event) {
    const args = eventToRollParams(event, { type: "check" });

    if (!statistic) {
        return actor.initiative?.roll(args);
    }

    const ActorInit = actor.initiative?.constructor as typeof ActorInitiative | undefined;
    if (!ActorInit) return;

    const initiative = new ActorInit(actor, {
        statistic,
        tiebreakPriority: actor.system.initiative!.tiebreakPriority,
    });

    initiative.roll(args);
}

export { hasRolledInitiative, rollInitiative };
