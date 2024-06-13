import { MODULE } from "./module";

function socketOn<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.on(`module.${MODULE.id}`, callback);
}

function socketOff<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.off(`module.${MODULE.id}`, callback);
}

function socketEmit<T extends object = object>(packet: T) {
    game.socket.emit(`module.${MODULE.id}`, packet);
}

export { socketEmit, socketOff, socketOn };
