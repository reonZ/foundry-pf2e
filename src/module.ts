import { joinStr } from "./utils";

let MODULE_ID = "";
let MODULE_NAME = "";

const MODULE = {
    get id() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_ID;
    },
    get name() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_NAME;
    },
    get current() {
        return game.modules.get(this.id)!;
    },
    throwError(str: string) {
        throw new Error(`\n[${this.name}] ${str}`);
    },
    error(str: string, error?: Error) {
        let message = `[${this.name}] ${str}`;

        if (error instanceof Error) {
            message += `\n${error.message}`;
        } else if (typeof error === "string") {
            message += `\n${error}`;
        }

        console.error(message);
    },
    log(str: string) {
        console.log(`[${this.name}] ${str}`);
    },
    path(...path: (string | string[])[]): `${string}.${string}` {
        return `${this.id}.${joinStr(".", ...path)}`;
    },
    register(id: string, name: string) {
        if (MODULE_ID) {
            throw new Error("Module was already registered.");
        }
        MODULE_ID = id;
        MODULE_NAME = name;
    },
};

function getActiveModule(name: "dice-so-nice"): ExtendedModule<DiseSoNiceModule> | undefined;
function getActiveModule(name: "pf2e-toolbelt"): ExtendedModule<PF2eToolbeltModule> | undefined;
function getActiveModule(name: "pf2e-dailies"): ExtendedModule<PF2eDailiesModule> | undefined;
function getActiveModule<T extends Module>(name: string): ExtendedModule<T> | undefined;
function getActiveModule<T extends Module>(name: string): ExtendedModule<T> | undefined {
    const module = game.modules.get<ExtendedModule<T>>(name);
    if (!module?.active) return;

    module.getSetting = <T = boolean>(key: string) => game.settings.get(name, key) as T;

    return module?.active ? module : undefined;
}

type ExtendedModule<TModule extends Module> = TModule & {
    getSetting<T = boolean>(key: string): T;
};

export { MODULE, getActiveModule };
