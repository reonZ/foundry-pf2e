declare function resolveTarget(target: {
    actor: ActorPF2e;
    token?: TokenDocumentPF2e;
}): TargetDocuments;
declare function resolveTarget(target: TargetDocuments | undefined): TargetDocuments | undefined;
export { resolveTarget };
