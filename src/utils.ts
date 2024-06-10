import * as R from "remeda";

function joinStr(separator: "/" | "." | "-", ...path: (string | string[])[]) {
    return R.pipe(
        path,
        R.flat(),
        R.filter((x) => typeof x === "string"),
        R.join(separator)
    );
}

function safeSplit(str: string, selector = ",") {
    return str
        .split(selector)
        .map((s) => s.trim())
        .filter(Boolean);
}

function beautity(str: string) {
    return str.replaceAll(/[-_.]([a-z])/g, (_, c) => ` ${c.toUpperCase()}`).capitalize();
}

function stringBoolean(b: boolean | string) {
    return String(b) as StringBoolean;
}

function stringNumber(n: number | string) {
    return String(n) as StringNumber;
}

function isInstanceOf(obj: any, cls: "ConsumablePF2e"): obj is ConsumablePF2e;
function isInstanceOf(obj: any, cls: "ActorPF2e"): obj is ActorPF2e;
function isInstanceOf<T>(obj: any, cls: string): obj is T;
function isInstanceOf(obj: any, cls: string) {
    if (typeof obj !== "object" || obj === null) return false;

    let cursor = Reflect.getPrototypeOf(obj);
    while (cursor) {
        if (cursor.constructor.name === cls) return true;
        cursor = Reflect.getPrototypeOf(cursor);
    }

    return false;
}

function rollDie(faces: number, nb = 1) {
    let total = 0;
    for (let i = 0; i < nb; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}

export { beautity, isInstanceOf, joinStr, rollDie, safeSplit, stringBoolean, stringNumber };
