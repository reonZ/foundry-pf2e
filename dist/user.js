"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canObserveActor = void 0;
function canObserveActor(actor) {
    if (!actor)
        return false;
    return actor.testUserPermission(game.user, "OBSERVER");
}
exports.canObserveActor = canObserveActor;
