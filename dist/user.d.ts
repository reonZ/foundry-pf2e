declare function canObserveActor(actor: Maybe<ActorPF2e>, withParty?: boolean): boolean | undefined;
declare function userIsGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
export { canObserveActor, hasGMOnline, userIsGM };
