function resolveTarget(
    target: TargetDocuments | undefined,
    uuids: true
): { actor: string; token?: string } | undefined;
function resolveTarget(
    target: TargetDocuments | undefined,
    uuids?: false
): TargetDocuments | undefined;
function resolveTarget(
    target: TargetDocuments | undefined,
    uuids?: boolean
): TargetDocuments | { actor: string; token?: string } | undefined {
    if (!target) return;

    const actor = target.actor;
    const token =
        target.token ??
        ((game.toolbelt?.getToolSetting("targetHelper", "enabled") &&
            target.actor.getActiveTokens(true, true).at(0)) ||
            undefined);

    return uuids ? { actor: actor.uuid, token: token?.uuid } : { actor, token };
}

export { resolveTarget };
