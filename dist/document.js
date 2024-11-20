"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTarget = void 0;
function resolveTarget(target) {
    if (!target)
        return;
    const actor = target.actor;
    const token = target.token ??
        ((game.toolbelt?.getToolSetting("targetHelper", "enabled") &&
            target.actor.getActiveTokens(true, true).at(0)) ||
            undefined);
    return { actor, token };
}
exports.resolveTarget = resolveTarget;
