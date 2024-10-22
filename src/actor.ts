import { eventToRollParams } from "./pf2e";

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

function rollInitiative(actor: ActorPF2e, statistic?: string, event?: Event) {
    const args = eventToRollParams(event, { type: "check" });

    if (!statistic) {
        return actor.initiative?.roll(args);
    }

    const ActorInit = actor.initiative?.constructor as typeof ActorInitiative | undefined;
    if (!ActorInit) return;

    const initiative = new ActorInit(actor, {
        statistic,
        tiebreakPriority: actor.system.initiative!.tiebreakPriority,
    });

    initiative.roll(args);
}

function canObserveActor(actor: Maybe<ActorPF2e>, withParty?: boolean) {
    if (!actor) return false;

    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER")) return true;

    return (
        withParty &&
        game.pf2e.settings.metagame.partyStats &&
        (actor as CreaturePF2e).parties?.some((party) => party.testUserPermission(user, "LIMITED"))
    );
}

function getWorldActor<T extends ActorPF2e>(actor: T): T;
function getWorldActor<T extends ActorPF2e>(actor: Maybe<T>): T | null;
function getWorldActor<T extends ActorPF2e>(actor: Maybe<T>): T | null {
    return (actor?.token?.baseActor as T | null) ?? actor ?? null;
}

export {
    canObserveActor,
    getAlliance,
    getDispositionColor,
    getFirstActiveToken,
    getHighestName,
    getOwner,
    getWorldActor,
    isPlayedActor,
    isOwner,
    rollInitiative,
};
