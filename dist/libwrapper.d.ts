declare function registerWrapper<P extends string | string[]>(path: P, callback: libWrapper.RegisterCallback, type?: libWrapper.RegisterType, context?: InstanceType<new (...args: any[]) => any>): P extends string[] ? number[] : number;
declare function unregisterWrapper(id: number): void;
declare function createWrapper(path: string, callback: libWrapper.RegisterCallback, options?: {
    context?: InstanceType<new (...args: any[]) => any>;
    type?: libWrapper.RegisterType;
    onDisable?: () => void;
    onActivate?: () => void;
}): Wrapper;
declare function wrapperError(path: string, error: Error): void;
type Wrapper = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
export type { Wrapper };
export { createWrapper, registerWrapper, unregisterWrapper, wrapperError };
