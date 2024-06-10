"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeout = void 0;
function createTimeout(callback, delay = 1) {
    let timeoutId = null;
    const cancel = () => {
        if (timeoutId === null)
            return;
        clearTimeout(timeoutId);
        timeoutId = null;
    };
    const fn = (...args) => {
        if (timeoutId !== null) {
            cancel();
        }
        if (delay < 1) {
            callback(...args);
        }
        else {
            timeoutId = setTimeout(callback, delay, ...args);
        }
    };
    Object.defineProperty(fn, "start", {
        value: (delay, ...args) => {
            if (timeoutId !== null) {
                cancel();
            }
            if (delay < 1) {
                callback(...args);
            }
            else {
                timeoutId = setTimeout(callback, delay, ...args);
            }
        },
        enumerable: false,
        configurable: false,
    });
    Object.defineProperty(fn, "cancel", {
        value: cancel,
        enumerable: false,
        configurable: false,
    });
    return fn;
}
exports.createTimeout = createTimeout;
