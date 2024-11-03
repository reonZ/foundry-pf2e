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

export {
    arrayIncludes,
    compareArrays,
    getUuidFromInlineMatch,
    joinStr,
    removeIndexFromArray,
    stringBoolean,
    stringNumber,
};
