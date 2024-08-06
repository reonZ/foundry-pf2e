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

function getAlliance(actor: ActorPF2e) {
    const allianceSource = actor._source.system.details?.alliance;
    const alliance = allianceSource === null ? "neutral" : allianceSource ?? "default";
    return alliance === "default" ? (actor.hasPlayerOwner ? "party" : "opposition") : alliance;
}

function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T {
    return !!actor?.id && !actor.pack && game.actors.has(actor.id);
}

function getHighestName(actor: ActorPF2e) {
    return actor.token?.name ?? actor.prototypeToken?.name ?? actor.name;
}

function getOwner(actor: ActorPF2e, activeOnly = true): UserPF2e | null {
    const isValidUser = (user: UserPF2e) => (!activeOnly || user.active) && !user.isGM;
    const validOwners = game.users.filter((user) => isValidUser(user));

    let owners = validOwners.filter((user) => user.character === actor);

    if (!owners.length) {
        owners = validOwners.filter((user) => actor.testUserPermission(user, "OWNER"));
    }

    owners.sort((a, b) => (a.id > b.id ? 1 : -1));

    return owners[0] || null;
}

function isOwner(actor: ActorPF2e) {
    return getOwner(actor) === game.user;
}

function getFirstDependentTokens(
    actor: ActorPF2e,
    { scene, linked = false }: { scene?: ScenePF2e | null; linked?: boolean } = {}
) {
    if (!canvas.ready) return null;
    if (actor.isToken && !scene) return actor.token;

    scene ??= canvas.scene!;

    if (actor.token) {
        const parent = actor.token.parent;
        return scene === parent ? actor.token : null;
    }

    const tokens = actor._dependentTokens.get(scene) ?? [];
    for (const token of tokens) {
        if (!linked || token.actorLink) {
            return token;
        }
    }

    return null;
}

function getFirstActiveToken(
    actor: ActorPF2e,
    linked: boolean,
    document: true,
    scene?: ScenePF2e
): TokenDocumentPF2e | null;
function getFirstActiveToken(
    actor: ActorPF2e,
    linked?: boolean,
    document?: false,
    scene?: ScenePF2e
): TokenPF2e | null;
function getFirstActiveToken(
    actor: ActorPF2e,
    linked = false,
    document = false,
    scene = canvas.scene ?? undefined
): TokenDocumentPF2e | TokenPF2e | null {
    if (!canvas.ready) return null;
    const token = getFirstDependentTokens(actor, { linked, scene });
    return document ? token : token?.rendered ? token.object : null;
}

export {
    getAlliance,
    getDispositionColor,
    getFirstActiveToken,
    getHighestName,
    getOwner,
    isPlayedActor,
    isOwner,
};
