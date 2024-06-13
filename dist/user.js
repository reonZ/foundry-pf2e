"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsGM = exports.hasGMOnline = exports.canObserveActor = void 0;
function canObserveActor(actor) {
    if (!actor)
        return false;
    return actor.testUserPermission(game.user, "OBSERVER");
}
exports.canObserveActor = canObserveActor;
function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}
function userIsGM(user) {
    user ??= getCurrentUser();
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}
exports.userIsGM = userIsGM;
function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}
exports.hasGMOnline = hasGMOnline;
