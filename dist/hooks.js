"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWhenReady = exports.registerUpstreamHook = exports.createHook = void 0;
function registerUpstreamHook(event, listener) {
    const id = Hooks.on(event, listener);
    const index = Hooks.events[event].findIndex((x) => x.id === id);
    if (index > 0) {
        const [hooked] = Hooks.events[event].splice(index, 1);
        Hooks.events[event].unshift(hooked);
    }
    return id;
}
exports.registerUpstreamHook = registerUpstreamHook;
function createHook(hooks, listener) {
    const hookIds = [];
    hooks = Array.isArray(hooks) ? hooks : [hooks];
    return {
        activate() {
            if (hookIds.length)
                return;
            for (const hook of hooks) {
                const id = Hooks.on(hook, listener);
                hookIds.push({ id, hook });
            }
        },
        disable() {
            if (!hookIds.length)
                return;
            for (const { hook, id } of hookIds) {
                Hooks.off(hook, id);
            }
            hookIds.length = 0;
        },
        toggle(enabled) {
            if (enabled)
                this.activate();
            else
                this.disable();
        },
    };
}
exports.createHook = createHook;
function runWhenReady(fn) {
    if (game.ready)
        fn();
    else
        Hooks.once("ready", fn);
}
exports.runWhenReady = runWhenReady;
