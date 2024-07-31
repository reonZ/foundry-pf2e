declare function canObserveActor(actor: Maybe<ActorPF2e>): boolean;
declare function userIsGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
export { canObserveActor, hasGMOnline, userIsGM };
