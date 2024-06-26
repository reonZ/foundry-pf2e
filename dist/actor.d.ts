declare function getDispositionColor(actor?: ActorPF2e | null): Color;
declare function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T;
declare function getHighestName(actor: ActorPF2e): string;
declare function getOwner(actor: ActorPF2e, activeOnly?: boolean): UserPF2e | null;
declare function isOwner(actor: ActorPF2e): boolean;
declare function getFirstActiveToken(actor: ActorPF2e, linked: boolean, document: true): TokenDocumentPF2e | null;
declare function getFirstActiveToken(actor: ActorPF2e, linked?: boolean, document?: false): TokenPF2e | null;
export { getDispositionColor, getFirstActiveToken, getHighestName, getOwner, isPlayedActor, isOwner, };
