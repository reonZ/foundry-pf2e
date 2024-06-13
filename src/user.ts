function canObserveActor<T extends Actor>(actor: T | null | undefined): actor is T {
    if (!actor) return false;
    return actor.testUserPermission(game.user, "OBSERVER");
}

function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}

function userIsGM(user?: User) {
    user ??= getCurrentUser();
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}

export { canObserveActor, hasGMOnline, userIsGM };
