import { MODULE } from "./module";

function isInstanceOf(obj: any, cls: "TokenDocumentPF2e"): obj is TokenDocumentPF2e;
function isInstanceOf(obj: any, cls: "CreatureConfig"): obj is CreatureConfig;
function isInstanceOf(obj: any, cls: "ConsumablePF2e"): obj is ConsumablePF2e;
function isInstanceOf(obj: any, cls: "DamageRoll"): obj is DamageRoll;
function isInstanceOf(obj: any, cls: "EffectPF2e"): obj is EffectPF2e;
function isInstanceOf(obj: any, cls: "ActorPF2e"): obj is ActorPF2e;
function isInstanceOf(obj: any, cls: "ItemPF2e"): obj is ItemPF2e;
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

function getInMemory<T>(obj: object, ...path: string[]) {
    return foundry.utils.getProperty<T>(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

function setInMemory<T>(obj: object, ...args: [...string[], T]) {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}

function getInMemoryAndSetIfNot<T>(obj: object, ...args: [...string[], (() => T) | T]) {
    const value = args.pop() as T | (() => T);
    const current = getInMemory<T>(obj, ...(args as string[]));
    if (current != null) return current;

    const result = typeof value === "function" ? (value as Function)() : value;
    setInMemory(obj, ...(args as string[]), result);
    return result as T;
}

function deleteInMemory(obj: object, ...path: string[]) {
    const split = ["modules", MODULE.id, ...path.flatMap((x) => x.split("."))];
    const last = split.pop() as string;

    let cursor: any = obj;

    for (const key of split) {
        if (typeof cursor !== "object" || !(key in cursor)) return true;
        cursor = cursor[key];
    }

    return delete cursor[last];
}

export { getInMemory, deleteInMemory, getInMemoryAndSetIfNot, isInstanceOf, rollDie, setInMemory };
