"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketOn = exports.socketOff = exports.socketEmit = void 0;
const module_1 = require("./module");
function socketOn(callback) {
    game.socket.on(`module.${module_1.MODULE.id}`, callback);
}
exports.socketOn = socketOn;
function socketOff(callback) {
    game.socket.off(`module.${module_1.MODULE.id}`, callback);
}
exports.socketOff = socketOff;
function socketEmit(packet) {
    game.socket.emit(`module.${module_1.MODULE.id}`, packet);
}
exports.socketEmit = socketEmit;
