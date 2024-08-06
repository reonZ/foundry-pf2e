declare function getDispositionColor(actor?: ActorPF2e | null): Color;
declare function getAlliance(actor: ActorPF2e): "party" | "opposition" | "neutral";
declare function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T;
declare function getHighestName(actor: ActorPF2e): string;
declare function getOwner(actor: ActorPF2e, activeOnly?: boolean): UserPF2e | null;
declare function isOwner(actor: ActorPF2e): boolean;
declare function getFirstActiveToken(actor: ActorPF2e, linked: boolean, document: true, scene?: ScenePF2e): TokenDocumentPF2e | null;
declare function getFirstActiveToken(actor: ActorPF2e, linked?: boolean, document?: false, scene?: ScenePF2e): TokenPF2e | null;
export { getAlliance, getDispositionColor, getFirstActiveToken, getHighestName, getOwner, isPlayedActor, isOwner, };
