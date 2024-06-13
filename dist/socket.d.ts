declare function socketOn<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketOff<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketEmit<T extends object = object>(packet: T): void;
export { socketEmit, socketOff, socketOn };
