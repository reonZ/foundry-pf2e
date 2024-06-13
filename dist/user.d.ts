declare function canObserveActor<T extends Actor>(actor: T | null | undefined): actor is T;
declare function userIsGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
export { canObserveActor, hasGMOnline, userIsGM };
