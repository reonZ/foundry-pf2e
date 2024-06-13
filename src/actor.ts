function getDispositionColor(actor?: ActorPF2e | null) {
    const alliance = actor?.alliance;
    const colorValue = !actor
        ? CONFIG.Canvas.dispositionColors.NEUTRAL
        : alliance === "party"
        ? actor.hasPlayerOwner
            ? CONFIG.Canvas.dispositionColors.PARTY
            : CONFIG.Canvas.dispositionColors.FRIENDLY
        : alliance === "opposition"
        ? CONFIG.Canvas.dispositionColors.HOSTILE
        : CONFIG.Canvas.dispositionColors.NEUTRAL;
    return new Color(colorValue);
}

function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T {
    return !!actor?.id && !actor.pack && game.actors.has(actor.id);
}

function getHighestName(actor: ActorPF2e) {
    return actor.token?.name ?? actor.prototypeToken?.name ?? actor.name;
}

function getOwner(actor: ActorPF2e): UserPF2e | null {
    const isValidUser = (user: UserPF2e) => user.active && !user.isGM;

    let owners = game.users.filter((user) => isValidUser(user) && user.character === actor);

    if (!owners.length) {
        owners = game.users.filter(
            (user) => isValidUser(user) && actor.testUserPermission(user, "OWNER")
        );
    }

    owners.sort((a, b) => (a.id > b.id ? 1 : -1));

    return owners[0] || null;
}

function isOwner(actor: ActorPF2e) {
    return getOwner(actor) === game.user;
}

export { getDispositionColor, getHighestName, getOwner, isPlayedActor, isOwner };
