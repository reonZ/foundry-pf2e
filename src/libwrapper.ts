import { MODULE } from "./module";

function registerWrapper<P extends string | string[]>(
    path: P,
    callback: libWrapper.RegisterCallback,
    type?: libWrapper.RegisterType,
    context?: InstanceType<new (...args: any[]) => any>
): P extends string[] ? number[] : number {
    const ids: number[] = [];
    const paths: string[] = Array.isArray(path) ? path : [path];

    const wrapped = context
        ? function (this: any, ...args: any[]) {
              args.unshift(this);
              callback.apply(context, args);
          }
        : callback;

    for (const key of paths) {
        const id = libWrapper.register(MODULE.id, key, wrapped, type);
        ids.push(id);
    }

    // @ts-ignore
    return ids.length === 1 ? ids[0] : ids;
}

function unregisterWrapper(id: number) {
    libWrapper.unregister(MODULE.id, id);
}

function createWrapper(
    path: string,
    callback: libWrapper.RegisterCallback,
    options: {
        context?: InstanceType<new (...args: any[]) => any>;
        type?: libWrapper.RegisterType;
        onDisable?: () => void;
        onActivate?: () => void;
    } = {}
): Wrapper {
    let wrapperId: number | null = null;

    return {
        activate() {
            if (wrapperId !== null) return;
            wrapperId = registerWrapper(path, callback, options.type ?? "WRAPPER", options.context);
            options.onActivate?.();
        },
        disable() {
            if (wrapperId === null) return;

            unregisterWrapper(wrapperId);
            wrapperId = null;
            options.onDisable?.();
        },
        toggle(enabled: boolean) {
            if (enabled) this.activate();
            else this.disable();
        },
    };
}

function wrapperError(path: string, error: Error) {
    MODULE.error(`an error occured in the wrapper\n${path}`, error);
}

type Wrapper = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};

export type { Wrapper };
export { createWrapper, registerWrapper, unregisterWrapper, wrapperError };
