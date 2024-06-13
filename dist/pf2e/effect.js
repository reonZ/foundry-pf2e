"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRemainingDuration = void 0;
const DURATION_UNITS = {
    rounds: 6,
    minutes: 60,
    hours: 3600,
    days: 86400,
};
function calculateRemainingDuration(effect, durationData, 
//added stuff
fightyActor) {
    if (durationData.unit === "encounter") {
        const isExpired = effect.system.expired;
        return { expired: !!isExpired, remaining: isExpired ? 0 : Infinity };
    }
    else if (durationData.unit === "unlimited" || !("start" in effect.system)) {
        return { expired: false, remaining: Infinity };
    }
    const start = effect.system.start.value;
    const { combatant } = game.combat ?? {};
    const { unit, expiry } = durationData;
    const duration = durationData.value * (DURATION_UNITS[durationData.unit] ?? 0);
    const addend = !combatant &&
        duration === 0 &&
        unit === "rounds" &&
        ["turn-end", "round-end"].includes(expiry ?? "")
        ? 1
        : 0;
    const remaining = start + duration + addend - game.time.worldTime;
    const result = { remaining, expired: remaining <= 0 };
    if (remaining === 0 && combatant?.actor) {
        const startInitiative = effect.system.start.initiative ?? 0;
        const currentInitiative = combatant.initiative ?? 0;
        fightyActor ??= effect.actor?.isOfType("familiar")
            ? effect.actor.master ?? effect.actor
            : effect.actor;
        const atTurnStart = () => startInitiative === currentInitiative &&
            combatant.actor === (effect.origin ?? fightyActor);
        result.expired =
            expiry === "turn-start"
                ? atTurnStart()
                : expiry === "turn-end"
                    ? currentInitiative < startInitiative
                    : expiry === "round-end"
                        ? remaining <= 0 && game.time.worldTime > start
                        : false;
    }
    return result;
}
exports.calculateRemainingDuration = calculateRemainingDuration;
