"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingDurationLabel = exports.getEnrichedDescriptions = exports.calculateRemainingDuration = void 0;
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
function getRemainingDurationLabel(remaining, initiative, expiry) {
    if (remaining >= 63_072_000) {
        // two years
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleYears", {
            years: Math.floor(remaining / 31_536_000),
        });
    }
    else if (remaining >= 31_536_000) {
        // one year
        return game.i18n.localize("PF2E.EffectPanel.RemainingDuration.SingleYear");
    }
    else if (remaining >= 1_209_600) {
        // two weeks
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleWeeks", {
            weeks: Math.floor(remaining / 604_800),
        });
    }
    else if (remaining > 604_800) {
        // one week
        return game.i18n.localize("PF2E.EffectPanel.RemainingDuration.SingleWeek");
    }
    else if (remaining >= 172_800) {
        // two days
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleDays", {
            days: Math.floor(remaining / 86_400),
        });
    }
    else if (remaining > 7_200) {
        // two hours
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleHours", {
            hours: Math.floor(remaining / 3_600),
        });
    }
    else if (remaining > 120) {
        // two minutes
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleMinutes", {
            minutes: Math.floor(remaining / 60),
        });
    }
    else if (remaining >= 12) {
        // two rounds
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleRounds", {
            rounds: Math.floor(remaining / 6),
        });
    }
    else if (remaining >= 6) {
        // one round
        return game.i18n.localize("PF2E.EffectPanel.RemainingDuration.SingleRound");
    }
    else if (remaining >= 2) {
        // two seconds
        return game.i18n.format("PF2E.EffectPanel.RemainingDuration.MultipleSeconds", {
            seconds: remaining,
        });
    }
    else if (remaining === 1) {
        // one second
        return game.i18n.localize("PF2E.EffectPanel.RemainingDuration.SingleSecond");
    }
    else {
        // zero rounds
        const key = expiry === "turn-end"
            ? "PF2E.EffectPanel.RemainingDuration.ZeroRoundsExpireTurnEnd"
            : "PF2E.EffectPanel.RemainingDuration.ZeroRoundsExpireTurnStart";
        return game.i18n.format(key, { initiative });
    }
}
exports.getRemainingDurationLabel = getRemainingDurationLabel;
function getEnrichedDescriptions(effects) {
    return Promise.all(effects.map(async (effect) => {
        const actor = "actor" in effect ? effect.actor : null;
        const rollData = { actor, item: effect };
        return await TextEditor.enrichHTML(effect.description, { rollData });
    }));
}
exports.getEnrichedDescriptions = getEnrichedDescriptions;
