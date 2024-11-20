function resolveTarget(target: { actor: ActorPF2e; token?: TokenDocumentPF2e }): TargetDocuments;
function resolveTarget(target: TargetDocuments | undefined): TargetDocuments | undefined;
function resolveTarget(target: TargetDocuments | undefined): TargetDocuments | undefined {
    if (!target) return;

    const actor = target.actor;
    const token =
        target.token ??
        ((game.toolbelt?.getToolSetting("targetHelper", "enabled") &&
            target.actor.getActiveTokens(true, true).at(0)) ||
            undefined);

    return { actor, token };
}

export { resolveTarget };
