"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsGM = exports.userIsActiveGM = exports.hasGMOnline = void 0;
function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}
function userIsGM(user) {
    user ??= getCurrentUser();
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}
exports.userIsGM = userIsGM;
function userIsActiveGM(user) {
    user ??= getCurrentUser();
    return user === game.users.activeGM;
}
exports.userIsActiveGM = userIsActiveGM;
function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}
exports.hasGMOnline = hasGMOnline;
