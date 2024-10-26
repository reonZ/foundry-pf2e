function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}

function userIsGM(user: User = getCurrentUser()) {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

function userIsActiveGM(user: User = getCurrentUser()) {
    return user === game.users.activeGM;
}

function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}

function setControlled(targets: (TokenPF2e | TokenDocumentPF2e)[]) {
    canvas.tokens.releaseAll();

    for (const target of targets) {
        const token = target instanceof TokenDocument ? target.object : target;
        token?.control({ releaseOthers: false });
    }
}

export { hasGMOnline, setControlled, userIsActiveGM, userIsGM };
