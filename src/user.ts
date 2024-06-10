function canObserveActor<T extends Actor>(actor: T | null | undefined): actor is T {
    if (!actor) return false;
    return actor.testUserPermission(game.user, "OBSERVER");
}

export { canObserveActor };
