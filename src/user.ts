function canObserveActor(actor: Maybe<ActorPF2e>, withParty?: boolean) {
    if (!actor) return false;

    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER")) return true;

    return (
        withParty &&
        (actor as CreaturePF2e).parties?.some((party) => party.testUserPermission(user, "LIMITED"))
    );
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
