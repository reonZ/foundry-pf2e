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

export { arrayIncludes, beautity, compareArrays, joinStr, safeSplit, stringBoolean, stringNumber };
