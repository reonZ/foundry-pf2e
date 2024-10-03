function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}

function userIsGM(user?: User) {
    user ??= getCurrentUser();
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

function userIsActiveGM(user?: User) {
    user ??= getCurrentUser();
    return user === game.users.activeGM;
}

function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}

export { hasGMOnline, userIsActiveGM, userIsGM };
