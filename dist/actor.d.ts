declare function getDispositionColor(actor?: ActorPF2e | null): Color;
declare function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T;
declare function getHighestName(actor: ActorPF2e): string;
declare function getOwner(actor: ActorPF2e): UserPF2e | null;
declare function isOwner(actor: ActorPF2e): boolean;
export { getDispositionColor, getHighestName, getOwner, isPlayedActor, isOwner };
