import { MODULE } from "./module";
import { joinStr } from "./utils";

type NotificationData = Record<string, string | number | boolean>;

function notify(
    str: string,
    arg1?: "warning" | "info" | "error" | NotificationData | boolean,
    arg2?: NotificationData | boolean,
    arg3?: boolean
): void {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : undefined;
    const permanent =
        typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;

    ui.notifications.notify(localize(str, data as NotificationData), type, { permanent });
}

function warn(str: string, arg1?: NotificationData | boolean, arg2?: boolean) {
    notify(str, "warning", arg1, arg2);
}

function info(str: string, arg1?: NotificationData | boolean, arg2?: boolean) {
    notify(str, "info", arg1, arg2);
}

function error(str: string, arg1?: NotificationData | boolean, arg2?: boolean) {
    notify(str, "error", arg1, arg2);
}

function localize(...args: LocalizeArgs) {
    args.unshift(MODULE.id);

    const data = typeof args.at(-1) === "object" ? (args.pop() as Record<string, any>) : undefined;
    const path = joinStr(".", args as string[]);

    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }

    return game.i18n.localize(path);
}

function templateLocalize(subKey: string) {
    const fn = (key: string, { hash }: { hash: Record<string, string> }) =>
        localize(subKey, key, hash);

    Object.defineProperties(fn, {
        path: {
            value: (key: string) => MODULE.path(subKey, key),
            enumerable: false,
            configurable: false,
        },
    });

    return fn;
}

function localeCompare(a: string, b: string) {
    return a.localeCompare(b, game.i18n.lang);
}

function hasLocalization(...path: string[]) {
    return game.i18n.has(`${MODULE.path(path)}`, false);
}

function localizeIfExist(...args: LocalizeArgs) {
    args.unshift(MODULE.id);

    const data = typeof args.at(-1) === "object" ? args.pop() : undefined;
    const path = joinStr(".", args as string[]);

    if (!game.i18n.has(path, false)) return;

    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }

    return game.i18n.localize(path);
}

function subLocalize(subKey: string) {
    const fn = (...args: LocalizeArgs) => localize(subKey, ...args);

    Object.defineProperties(fn, {
        ifExist: {
            value: (...args: LocalizeArgs) => localizeIfExist(subKey, ...args),
            enumerable: false,
            configurable: false,
        },
        warn: {
            value: (str: string, arg1?: Record<string, string> | boolean, arg2?: boolean) =>
                warn(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        info: {
            value: (str: string, arg1?: Record<string, string> | boolean, arg2?: boolean) =>
                info(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        error: {
            value: (str: string, arg1?: Record<string, string> | boolean, arg2?: boolean) =>
                error(`${subKey}.${str}`, arg1, arg2),
            enumerable: false,
            configurable: false,
        },
        has: {
            value: (key: string) => hasLocalization(subKey, key),
            enumerable: false,
            configurable: false,
        },
        path: {
            value: (key: string) => MODULE.path(subKey, key),
            enumerable: false,
            configurable: false,
        },
        sub: {
            value: (key: string) => subLocalize(`${subKey}.${key}`),
            enumerable: false,
            configurable: false,
        },
        i18n: {
            get() {
                return templateLocalize(subKey);
            },
            enumerable: false,
            configurable: false,
        },
    });

    return fn as typeof localize & {
        ifExist: typeof localizeIfExist;
        has: typeof hasLocalization;
        path: typeof MODULE.path;
        warn: typeof warn;
        info: typeof info;
        error: typeof error;
        i18n: typeof templateLocalize;
        sub: typeof subLocalize;
    };
}

type LocalizeArgs = [...string[], string | Record<string, any>];

export {
    error,
    hasLocalization,
    info,
    localeCompare,
    localize,
    localizeIfExist,
    subLocalize,
    templateLocalize,
    warn,
};
