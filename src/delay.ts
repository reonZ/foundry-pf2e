function createTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, delay: number = 1) {
    let timeoutId: NodeJS.Timeout | null = null;

    const cancel = () => {
        if (timeoutId === null) return;

        clearTimeout(timeoutId);
        timeoutId = null;
    };

    const fn = (...args: TArgs) => {
        if (timeoutId !== null) {
            cancel();
        }

        if (delay < 1) {
            callback(...args);
        } else {
            timeoutId = setTimeout(callback, delay, ...args);
        }
    };

    Object.defineProperty(fn, "start", {
        value: (delay: number, ...args: TArgs) => {
            if (timeoutId !== null) {
                cancel();
            }

            if (delay < 1) {
                callback(...args);
            } else {
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

    return fn as ((...args: TArgs) => void) & {
        start: (delay: number, ...args: TArgs) => void;
        cancel: () => void;
    };
}

export { createTimeout };
