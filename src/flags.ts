import { MODULE } from "./module";
import * as R from "remeda";

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlag<T>(doc: foundry.abstract.Document, ...args: [...string[], T]) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}

function unsetFlag(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.unsetFlag(MODULE.id, path.join("."));
}

function flagPath(...path: string[]): `flags.${typeof MODULE.id}.${string}` {
    return `flags.${MODULE.path(path)}`;
}

function getFlagProperty<T>(obj: MaybeFlags, ...path: string[]) {
    return foundry.utils.getProperty<T>(obj, flagPath(...path));
}

function setFlagProperty<T extends MaybeFlags>(obj: T, ...args: [...string[], any]): T {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}

function unsetFlagProperty<T extends MaybeFlags>(obj: T, ...path: string[]): T {
    const last = path.pop()!;
    setFlagProperty(obj, ...path, `-=${last}`, true);
    return obj;
}

function deleteFlagProperty<T extends MaybeFlags>(obj: T, ...path: string[]): T {
    const last = path.pop()!;
    const cursor = getFlagProperty<Maybe<Record<string, unknown>>>(obj, ...path);

    if (R.isObjectType(cursor)) {
        delete cursor[last];
    }

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

function updateSourceFlag(doc: foundry.abstract.Document, ...args: [...string[], any]) {
    const value = args.pop();
    return doc.updateSource({
        [flagPath(...args)]: value,
    });
}

type MaybeFlags = { flags?: Record<string, unknown> };

export {
    deleteFlagProperty,
    flagPath,
    getFlag,
    getFlagProperty,
    getModuleFlag,
    hasModuleFlag,
    setFlag,
    setFlagProperty,
    unsetFlag,
    updateFlag,
    updateSourceFlag,
    unsetFlagProperty,
    unsetMofuleFlag,
};
