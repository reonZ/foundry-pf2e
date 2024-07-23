"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.isPlayedActor = exports.getOwner = exports.getHighestName = exports.getFirstActiveToken = exports.getDispositionColor = exports.getAlliance = void 0;
function getDispositionColor(actor) {
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
exports.getDispositionColor = getDispositionColor;
function getAlliance(actor) {
    const allianceSource = actor._source.system.details?.alliance;
    const alliance = allianceSource === null ? "neutral" : allianceSource ?? "default";
    const defaultAlliance = actor.hasPlayerOwner ? "party" : "opposition";
    return {
        defaultAlliance,
        originalAlliance: alliance,
        alliance: alliance === "default" ? defaultAlliance : alliance,
    };
}
exports.getAlliance = getAlliance;
function isPlayedActor(actor) {
    return !!actor?.id && !actor.pack && game.actors.has(actor.id);
}
exports.isPlayedActor = isPlayedActor;
function getHighestName(actor) {
    return actor.token?.name ?? actor.prototypeToken?.name ?? actor.name;
}
exports.getHighestName = getHighestName;
function getOwner(actor, activeOnly = true) {
    const isValidUser = (user) => (!activeOnly || user.active) && !user.isGM;
    const validOwners = game.users.filter((user) => isValidUser(user));
    let owners = validOwners.filter((user) => user.character === actor);
    if (!owners.length) {
        owners = validOwners.filter((user) => actor.testUserPermission(user, "OWNER"));
    }
    owners.sort((a, b) => (a.id > b.id ? 1 : -1));
    return owners[0] || null;
}
exports.getOwner = getOwner;
function isOwner(actor) {
    return getOwner(actor) === game.user;
}
exports.isOwner = isOwner;
function getFirstDependentTokens(actor, { scene, linked = false } = {}) {
    if (!canvas.ready)
        return null;
    if (actor.isToken && !scene)
        return actor.token;
    scene ??= canvas.scene;
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
function getFirstActiveToken(actor, linked = false, document = false, scene = canvas.scene ?? undefined) {
    if (!canvas.ready)
        return null;
    const token = getFirstDependentTokens(actor, { linked, scene });
    return document ? token : token?.rendered ? token.object : null;
}
exports.getFirstActiveToken = getFirstActiveToken;
