import * as R from "remeda";

function joinStr(separator: "/" | "." | "-", ...path: (string | string[])[]) {
    return R.pipe(
        path,
        R.flat(),
        R.filter((x) => typeof x === "string"),
        R.join(separator)
    );
}

function stringBoolean(b: boolean | string) {
    return String(b) as StringBoolean;
}

function stringNumber(n: number | string) {
    return String(n) as StringNumber;
}

function beautifySlug(slug: string) {
    return game.pf2e.system
        .sluggify(slug, { camel: "bactrian" })
        .replace(/([a-z])([A-Z])/g, "$1 $2");
}

function compareArrays<T extends any>(arr1: T[], arr2: T[], unique = false) {
    arr1 = unique ? R.filter(arr1, R.isTruthy) : arr1;
    arr2 = unique ? R.filter(arr2, R.isTruthy) : arr2.slice();

    if (arr1.length !== arr2.length) return false;

    for (const value1 of arr1) {
        const index = arr2.findIndex((value2) => value1 === value2);
        if (index === -1) return false;
        arr2.splice(index, 1);
    }

    return true;
}

function arrayIncludes(array: string[], other: string[]): boolean {
    return other.some((value) => array.includes(value));
}

function getUuidFromInlineMatch(match: RegExpExecArray) {
    return match[1] === "Compendium" ? `Compendium.${match[2]}` : match[2];
}

function removeIndexFromArray<T extends any[]>(array: T, index: number, copy = true): T {
    const usedArray = (copy ? array.slice() : array) as T;
    if (index < 0 || index >= array.length) return usedArray;

    usedArray.splice(index, 1);
    return usedArray;
}

function runWhenReady(fn: () => void) {
    if (game.ready) fn();
    else Hooks.once("ready", fn);
}

function rollDie(faces: number, nb = 1) {
    let total = 0;
    for (let i = 0; i < nb; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}

export {
    arrayIncludes,
    beautifySlug,
    compareArrays,
    getUuidFromInlineMatch,
    joinStr,
    removeIndexFromArray,
    rollDie,
    runWhenReady,
    stringBoolean,
    stringNumber,
};
