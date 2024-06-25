"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.isPlayedActor = exports.getOwner = exports.getHighestName = exports.getDispositionColor = void 0;
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
