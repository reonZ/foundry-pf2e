function registerUpstreamHook<P extends unknown[]>(event: string, listener: HookCallback<P>) {
    const id = Hooks.on(event, listener);
    const index = Hooks.events[event].findIndex((x) => x.id === id);

    if (index !== 0) {
        const [hooked] = Hooks.events[event].splice(index, 1);
        Hooks.events[event].unshift(hooked);
    }

    return id;
}

function createHook<P extends unknown[]>(hooks: string | string[], listener: HookCallback<P>) {
    const hookIds: { id: number; hook: string }[] = [];
    hooks = Array.isArray(hooks) ? hooks : [hooks];

    return {
        activate() {
            if (hookIds.length) return;
            for (const hook of hooks) {
                const id = Hooks.on(hook, listener);
                hookIds.push({ id, hook });
            }
        },
        disable() {
            if (!hookIds.length) return;
            for (const { hook, id } of hookIds) {
                Hooks.off(hook, id);
            }
            hookIds.length = 0;
        },
        toggle(enabled: boolean) {
            if (enabled) this.activate();
            else this.disable();
        },
    };
}

export { createHook, registerUpstreamHook };
