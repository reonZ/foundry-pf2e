"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMacroActor = void 0;
const object_1 = require("../object");
function resolveMacroActor(uuid) {
    if (uuid) {
        const actor = fromUuidSync(uuid);
        return (0, object_1.isInstanceOf)(actor, "ActorPF2e") ? actor : null;
    }
    const speaker = ChatMessage.getSpeaker();
    return (canvas.tokens.get(speaker.token ?? "")?.actor ??
        game.actors.get(speaker.actor ?? "") ??
        null);
}
exports.resolveMacroActor = resolveMacroActor;
