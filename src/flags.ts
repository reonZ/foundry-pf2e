import { MODULE } from "./module";
import * as R from "remeda";

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlag(doc: foundry.abstract.Document, ...args: [...string[], any]) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}

function unsetFlag(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.unsetFlag(MODULE.id, path.join("."));
}

function flagPath(...path: string[]): `flags.${typeof MODULE.id}.${string}` {
    return `flags.${MODULE.path(path)}`;
}

function getFlagProperty<T>(obj: object, ...path: string[]) {
    return foundry.utils.getProperty<T>(obj, flagPath(...path));
}

function setFlagProperty(obj: object, ...args: [...string[], any]) {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}

function updateFlag<T extends Record<string, unknown>>(
    doc: foundry.abstract.Document,
    updates: Partial<Record<keyof T, T[keyof T]>> & { [k: string]: any }
) {
    const pathed = R.mapKeys(updates, (key) => flagPath(key as string));
    return doc.update(pathed);
}

function getModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document) {
    return foundry.utils.getProperty<T>(doc, `flags.${MODULE.id}`);
}

function hasModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document) {
    return getModuleFlag<T>(doc) !== undefined;
}

function unsetMofuleFlag(doc: foundry.abstract.Document) {
    return doc.update({
        [`flags.-=${MODULE.id}`]: true,
    });
}

export {
    flagPath,
    getFlag,
    getFlagProperty,
    getModuleFlag,
    hasModuleFlag,
    setFlag,
    setFlagProperty,
    unsetFlag,
    updateFlag,
    unsetMofuleFlag,
};
