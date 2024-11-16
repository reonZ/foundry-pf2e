declare function resolveTarget(target: TargetDocuments | undefined, uuids: true): {
    actor: string;
    token?: string;
} | undefined;
declare function resolveTarget(target: TargetDocuments | undefined, uuids?: false): TargetDocuments | undefined;
export { resolveTarget };
