declare function registerUpstreamHook<P extends unknown[]>(event: string, listener: HookCallback<P>): number;
declare function createHook<P extends unknown[]>(hooks: string | string[], listener: HookCallback<P>): {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
export { createHook, registerUpstreamHook };
